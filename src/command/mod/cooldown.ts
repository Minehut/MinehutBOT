import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { Message } from 'discord.js';
import humanizeDuration from 'humanize-duration';

export default class ChannelCooldownCommand extends MinehutCommand {
	constructor() {
		super('cooldown', {
			aliases: ['cooldown'],
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.Moderator,
			description: {
				content: 'Set a cooldown for a channel',
				usage: '<duration>',
				examples: ['5s', '10s'],
			},
			args: [
				{
					id: 'duration',
					type: 'duration',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, how long should the cooldown be?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid duration.`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ duration }: { duration: number }
	) {
		if (msg.channel.type !== 'text')
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} specified channel is not a text channel`
			);

		const durationInSeconds = duration / 1000;
		const humanReadable = humanizeDuration(duration, {
			largest: 3,
			round: true,
		});

		if (msg.channel.rateLimitPerUser === 0 && durationInSeconds === 0)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} cannot disable cooldown when cooldown is already disabled`
			);
		if (msg.channel.rateLimitPerUser === durationInSeconds)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} channel cooldown is already set to this duration`
			);
		if (durationInSeconds > 21600)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} cannot set cooldown to be longer than 6 hours`
			);

		msg.channel.setRateLimitPerUser(durationInSeconds);
		this.client.emit('channelCooldownSet', msg.channel, msg.member!, duration);

		if (durationInSeconds === 0)
			return msg.channel.send(
				`${process.env.EMOJI_CHECK} disabled cooldown for channel **${msg.channel}**`
			);
		else
			return msg.channel.send(
				`${process.env.EMOJI_CHECK} set cooldown for channel **${msg.channel}** to **${humanReadable}**`
			);
	}
}
