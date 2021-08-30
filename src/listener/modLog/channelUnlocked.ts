import { Listener } from 'discord-akairo';
import { GuildMember, TextChannel } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { sendModLogMessage } from '../../util/functions';

export default class ChannelUnlocked extends Listener {
	constructor() {
		super('channelUnlocked', {
			emitter: 'client',
			event: 'channelUnlocked',
		});
	}

	async exec(member: GuildMember, channels: TextChannel[]) {
		const config = guildConfigs.get(member.guild.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('channelUnlocked') ||
			channels.length == 0
		)
			return;
		const mappedChannels = channels.map(
			channel => `**•** ${channel} (\`${channel.id}\`)`
		);
		await sendModLogMessage(
			member.guild,
			`:unlock: ${member.user.tag} (\`${
				member.user.id
			}\`) unlocked channels: \n${mappedChannels.join('\n')}`
		);
	}
}
