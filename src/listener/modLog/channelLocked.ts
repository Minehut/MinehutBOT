import { Listener } from 'discord-akairo';
import { GuildMember, TextChannel } from 'discord.js';
import { sendModLogMessage } from '../../util/functions';

export default class ChannelLockedListener extends Listener {
	constructor() {
		super('channelLocked', {
			emitter: 'client',
			event: 'channelLocked',
		});
	}

	async exec(member: GuildMember, channels: TextChannel[]) {
		if (channels.length == 0) return;
		const mappedChannels = channels.map(
			channel => `**•** ${channel} (\`${channel.id}\`)`
		);
		await sendModLogMessage(
			member.guild,
			`:lock: ${member.user.tag} (\`${
				member.user.id
			}\`) locked channels: \n${mappedChannels.join('\n')}`
		);
	}
}
