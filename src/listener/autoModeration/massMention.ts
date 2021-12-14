import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import parse from 'parse-duration';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MuteAction } from '../../structure/action/mute';
import { FOREVER_MS } from '../../util/constants';

export default class AutoModerationMassMentionListener extends Listener {
	constructor() {
		super('autoModerationMassMention', {
			emitter: 'client',
			event: 'messageCreate',
		});
	}

	async exec(msg: Message) {
		if (!msg.guild) return;
		const guildConfig = guildConfigs.get(msg.guild.id);
		if (msg.mentions.users.size > 0)
			this.client.mentionCacheManager.addValue(msg.id, msg);
		const memberMentionCache = this.client.mentionCacheManager.filterValues(
			v => v.author.id == msg.author.id
		);
		const guildMemberMentions = memberMentionCache.filter(
			m => m.guild!.id == msg.guild!.id
		);
		// if there are zero messages in cache then there is no need to go any further--the message author has not mentioned anyone
		if (guildMemberMentions.size == 0) return;
		const mentionCount = guildMemberMentions
			.map(m => m.mentions.users.size)
			.reduce((acc, a) => acc + a);
		if (
			!guildConfig ||
			!guildConfig.features.autoModeration?.massMention ||
			mentionCount <
				(guildConfig.features.autoModeration.massMention.mentionSize || 15)
		)
			return;
		guildMemberMentions.forEach(async (v, k) => {
			await v.delete().catch(() => {
				// message was probably already deleted
			});
			this.client.mentionCacheManager.removeValue(k);
		});
		const muteLength =
			guildConfig.features.autoModeration.massMention.muteLength?.toLowerCase() ||
			'3h';
		let parsedMuteLength =
			muteLength == 'forever' ? FOREVER_MS : parse(muteLength);
		if (!parsedMuteLength) parsedMuteLength = FOREVER_MS;
		const muteAction = new MuteAction({
			guild: msg.guild,
			moderator: msg.guild.members.resolve(this.client.user!.id)!,
			client: this.client,
			reason: `Spam Detected (${mentionCount} user mentions accumulated in ${guildMemberMentions.size} message(s))`,
			target: msg.member!,
			duration: parsedMuteLength,
		});
		await muteAction.commit();
	}
}
