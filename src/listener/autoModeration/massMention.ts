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
			m => m.author.id == msg.author.id && m.guild!.id == msg.guild!.id
		);
		// if there are zero messages in cache then there is no need to go any further--the message author has not mentioned anyone
		if (memberMentionCache.size == 0) return;
		const mentionCount = memberMentionCache
			.map(m => m.mentions.users.size)
			.reduce((acc, a) => acc + a);
		if (
			!guildConfig ||
			!guildConfig.features.autoModeration?.massMention ||
			mentionCount <
				(guildConfig.features.autoModeration.massMention.mentionSize || 15)
		)
			return;
		memberMentionCache.forEach(async (v, k) => {
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
			reason: `Spam Detected (${mentionCount} user mentions accumulated in ${memberMentionCache.size} message(s))`,
			target: msg.member!,
			duration: parsedMuteLength,
		});
		await muteAction.commit();
	}
}
