import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { Message } from 'discord.js';
import { Channel } from 'discord.js';
import { TextChannel } from 'discord.js';
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
				usage: '<channel> <cooldown>',
				examples: ['#general 5s', '#random 10s'],
			},
			args: [
				{
					id: 'channel',
					type: 'channel',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which channel would you like to set a cooldown for?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid channel.`,
					},
				},
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
		{ channel, duration }: { channel: Channel; duration: number }
	) {
		if (channel.type !== 'text')
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} specified channel is not a text channel`
			);

		const textChannel = channel as TextChannel;
		const durationInSeconds = duration / 1000;
		const humanReadable = humanizeDuration(duration, {
			largest: 3,
			round: true,
		});

		if (textChannel.rateLimitPerUser === 0 && durationInSeconds === 0)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} cannot disable cooldown when cooldown is already disabled`
			);
		if (textChannel.rateLimitPerUser === durationInSeconds)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} channel cooldown is already set to this duration`
			);
		if (durationInSeconds > 21600)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} cannot set cooldown to be longer than 6 hours`
			);

		textChannel.setRateLimitPerUser(durationInSeconds);
		this.client.emit('channelCooldownSet', textChannel, msg.member!, duration);

		if (durationInSeconds === 0)
			return msg.channel.send(
				`${process.env.EMOJI_CHECK} disabled cooldown for channel **${textChannel}**`
			);
		else
			return msg.channel.send(
				`${process.env.EMOJI_CHECK} set cooldown for channel **${textChannel}** to **${humanReadable}**`
			);
	}
}
