import { CaseType, HASTEBIN_URL, IMAGE_LINK_REGEX } from './constants';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { guildConfigs } from '../guild/config/guildConfigs';
import { Guild, Message, TextChannel, Util } from 'discord.js';
import { CENSOR_RULES, CensorRuleType } from './censorRules';
import { getPermissionLevel } from './permission/getPermissionLevel';
import { MinehutClient } from '../client/minehutClient';
import { cloneDeep } from 'lodash';
import { PermissionLevel } from './permission/permissionLevel';
import path from 'path';
import { GuildMember } from 'discord.js';
import { BoosterPassModel } from '../model/boosterPass';
import fetch from 'node-fetch';
import { Octokit } from '@octokit/rest';

TimeAgo.addLocale(en);
export const ago = new TimeAgo('en-US');

// todo: Maybe move this to a base Action class? OOP FTW
export function humanReadableCaseType(
	type: CaseType,
	startUppercase: boolean = true
) {
	let readable;
	switch (type) {
		case CaseType.Ban:
			readable = 'banned';
			break;
		case CaseType.ForceBan:
			readable = 'forcebanned';
			break;
		case CaseType.Kick:
			readable = 'kicked';
			break;
		case CaseType.Mute:
			readable = 'muted';
			break;
		case CaseType.SoftBan:
			readable = 'softbanned';
			break;
		case CaseType.UnMute:
			readable = 'unmuted';
			break;
		case CaseType.UnVoiceMute:
			readable = 'unvoicemuted';
			break;
		case CaseType.UnBan:
			readable = 'unbanned';
			break;
		case CaseType.VoiceKick:
			readable = 'voicekicked';
			break;
		case CaseType.VoiceMute:
			readable = 'voicemuted';
			break;
		case CaseType.Warn:
			readable = 'warned';
			break;
		default:
			readable = 'punished';
	}
	return startUppercase
		? readable.charAt(0).toUpperCase() + readable.slice(1)
		: readable;
}

// This function will format a Date object to a string like DD/MM/YYYY HH:MM:SS and optionally (x time ago), by default if the Date is -1 it will return "N/A"
// I wrote it in util so I don't need to copy this in every command that needs nice dates
export function prettyDate(
	date: Date,
	relative: boolean = true,
	prettyInvalid: boolean = true
) {
	return prettyInvalid
		? date.getTime() === -1
			? 'N/A'
			: `${date.getDate()}/${
					date.getMonth() + 1
			  }/${date.getFullYear()} ${date.toLocaleTimeString()}${
					relative ? ` (${ago.format(date)})` : ''
			  }`
		: `${date.getDate()}/${
				date.getMonth() + 1
		  }/${date.getFullYear()} ${date.toLocaleTimeString()}${
				relative ? ` (${ago.format(date)})` : ''
		  }`;
}

// Thanks to https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export function randomAlphanumericString(length: number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export function removeMarkdownAndMentions(content: string, msg?: Message) {
	return Util.escapeMarkdown(
		msg ? Util.cleanContent(content, msg) : Util.removeMentions(content)
	);
}

export async function sendModLogMessage(
	guild: Guild,
	content: string,
	attachmentUrls: string[] = []
) {
	const config = guildConfigs.get(guild.id);
	if (!config || !config.features.modLog) return;
	const channel = guild.client.channels.cache.get(
		config.features.modLog.channel
	) as TextChannel;
	const date = new Date();
	channel?.send(
		`**\`${prettyDate(date, false, false)}\`** ${
			config.features.modLog.prefix
		} ${content}`,
		{ files: attachmentUrls }
	);
}

// Thanks draem
export function arrayDiff<T>(aArray: T[], bArray: T[]) {
	const added = bArray.filter(e => !aArray.includes(e));
	const removed = aArray.filter(e => !bArray.includes(e));

	return {
		added,
		removed,
	};
}

const { Swear, CopyPasta, Invite, Spam, Zalgo } = CensorRuleType;

export interface CensorCheckResponse {
	rule: {
		rule: string;
		type: CensorRuleType;
		enabled: boolean;
	};
	match: RegExpMatchArray;
}

export async function censorMessage(msg: Message) {
	if (!msg.guild || !msg.deletable || msg.author.bot) return;
	const config = guildConfigs.get(msg.guild.id);
	if (!config || !config.features.censor) return;
	const override = config.features.censor.overrides.find(o =>
		o.type === 'channel'
			? o.id === msg.channel.id
			: o.id === (msg.channel as TextChannel).parentID
	);
	const featureConf = cloneDeep(config.features.censor);
	const censorConfig = override
		? Object.assign(featureConf, override.config)
		: featureConf;
	const bypassCensor =
		getPermissionLevel(msg.member!, msg.client as MinehutClient) >=
		(censorConfig.minimumBypassPermission || PermissionLevel.Helper);
	if (bypassCensor) return;

	const canChat =
		getPermissionLevel(msg.member!, msg.client as MinehutClient) >=
		(censorConfig.minimumChatPermission || PermissionLevel.Everyone);
	if (!canChat) {
		await msg.delete({ reason: 'Below needed chat permission level!' });
		return;
	}

	const filter = checkString(msg.content);
	if (!filter) return false;

	const type = filter.rule.type;

	if (
		type === Invite &&
		censorConfig.inviteWhitelist &&
		!censorConfig.allowInvites
	) {
		const { invite } = filter.match.groups!;
		try {
			const inv = await msg.client.fetchInvite(invite);

			if (inv.guild && censorConfig.inviteWhitelist.includes(inv.guild.id))
				return false; // Whitelisted invite
		} catch (err) {} // Invalid invite
	}

	if (type === CopyPasta && censorConfig.allowCopyPasta) return false;

	if (type === Swear && censorConfig.allowSwearing) return false;

	if (type === Zalgo && censorConfig.allowZalgo) return false;

	if (type === Spam && censorConfig.allowSpam) return false;

	await msg.delete({ reason: 'Automated chat filter' });
	const feedbackString = msg.content
		.trim()
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.replace(new RegExp(filter.rule.rule, 'i'), '>>>$1<<<');
	(msg.client as MinehutClient).emit('messageCensor', msg, filter);
	try {
		msg.author.send(
			`Your message was deleted because it was caught by our automated chat filter.\nIf you believe this is a mistake, please use the **!meta** command in the Minehut Discord and tell us about the issue.\n\n\`${feedbackString}\``
		);
	} catch (err) {} // Could not DM the user
}

export function checkString(content: string): CensorCheckResponse | undefined {
	content = content.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
	const enabledRules = CENSOR_RULES.filter(r => r.enabled);
	for (let i = 0; i < enabledRules.length; i++) {
		const rule = enabledRules[i];
		const regex = new RegExp(rule.rule, 'i');
		const match = content.match(regex);
		if (match) return { rule, match };
	}
}

export function findImageFromMessage(msg: Message): string | undefined {
	let returnAttachment: string | undefined;
	const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

	const attachment = msg.attachments.find(file =>
		extensions.includes(path.extname(file.url))
	);

	if (attachment) returnAttachment = attachment.url;

	if (!returnAttachment) {
		const match = msg.content.match(IMAGE_LINK_REGEX);
		if (match && extensions.includes(path.extname(match[0])))
			returnAttachment = match[0];
	}

	return returnAttachment;
}

export async function revokeGrantedBoosterPasses(member: GuildMember) {
    const boosterPasses = await BoosterPassModel.getGrantedByMember(member);
    if (boosterPasses.length > 0) 
        boosterPasses.forEach(async bp => {
            await bp.remove();
            const boosterPassRole = guildConfigs
                .get(member.guild.id)?.roles.boostersPass;
            if (!boosterPassRole)
                throw new Error(`Guild ${member.guild.id} does not have a configured booster pass role!`);
            const boosterPassReceiver = await member.guild.members.fetch(bp.grantedId);
            if (!boosterPassReceiver) return;
            const receiverReceivedPasses = await BoosterPassModel.getReceivedByMember(boosterPassReceiver);
            if (
                receiverReceivedPasses.length < 0 &&
                boosterPassReceiver.roles.cache.has(boosterPassRole)
            )
                boosterPassReceiver.roles.remove(boosterPassRole);
        });  
}

export async function generateHastebinFromInput(input: string, ext: string) {
	const res = await fetch(`${HASTEBIN_URL}/documents`, {
		method: 'POST',
		body: input,
		headers: { 'Content-Type': 'text/plain' },
	});
	if (!res.ok)
		throw new Error(`Error while generating hastebin: ${res.statusText}`);
	const { key }: { key: string } = await res.json();
	return `${HASTEBIN_URL}/${key}.${ext}`;
}

const octokit = new Octokit();
export async function getIssue(
	client: MinehutClient,
	repoOwner: string,
	repoName: string,
	issueNumber: number,
	bypassCache?: boolean
) {
	if (!bypassCache) {
		const issue = client.githubCacheManager.getValue(issueNumber);
		if (issue) return issue; // Checks if issue is stored locally to reduce the number of API requests
	}
	try {
		const issue = await octokit.issues.get({
			owner: repoOwner,
			repo: repoName,
			issue_number: issueNumber,
		});
		if (issue.data.pull_request) return null;
		client.githubCacheManager.addValue(issueNumber, issue);
		return issue;
	} catch {
		return null;
	}
}
