import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { TextChannel } from 'discord.js';
import { sendModLogMessage } from '../../util/functions';
import humanizeDuration from 'humanize-duration';

export default class ModLogChannelCooldownSetListener extends Listener {
	constructor() {
		super('channelCooldownSet', {
			emitter: 'client',
			event: 'channelCooldownSet',
		});
	}

	async exec(channel: TextChannel, member: GuildMember, duration: number) {
		const humanizedDuration = humanizeDuration(duration, {
			largest: 3,
			round: true,
		});

		if (duration === 0)
			await sendModLogMessage(
				channel.guild,
				`:clock: **${member.user.tag}** (\`${member.id}\`) disabled cooldown in **${channel.name}** (\`${channel.id}\`)`
			);
		else
			await sendModLogMessage(
				channel.guild,
				`:clock: **${member.user.tag}** (\`${member.id}\`) set cooldown in **${channel.name}** (\`${channel.id}\`) to **${humanizedDuration}**`
			);
	}
}
