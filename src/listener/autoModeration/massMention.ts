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
		if (
			!guildConfig ||
			!guildConfig.features.autoModeration?.massMention ||
			msg.mentions.users.size <
				(guildConfig.features.autoModeration.massMention.mentionSize || 10)
		)
			return;
		await msg.delete();
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
			reason: `Spam Detected (${msg.mentions.users.size} user mentions in a message)`,
			target: msg.member!,
			duration: parsedMuteLength,
		});
		await muteAction.commit();
	}
}
