import { CaseType } from './constants';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { guildConfigs } from '../guild/guildConfigs';
import { TextChannel, Util, Guild, Message } from 'discord.js';
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

export async function sendModLogMessage(guild: Guild, content: string) {
	const config = guildConfigs.get(guild.id);
	if (!config || !config.features.modLog) return;
	const channel = guild.channels.cache.get(
		config.features.modLog.channel
	) as TextChannel;
	const date = new Date();
	channel.send(
		`**\`${prettyDate(date, false, false)}\`** ${
			config.features.modLog.prefix
		} ${content}`
	);
}

// Thanks draem
export function arrayDiff(aArray: any[], bArray: any[]) {
	const added = bArray.filter(e => !aArray.includes(e));
	const removed = aArray.filter(e => !bArray.includes(e));

	return {
		added,
		removed,
	};
}
