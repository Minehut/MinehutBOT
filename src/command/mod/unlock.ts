import { PrefixSupplier } from 'discord-akairo';
import { Message, Permissions, TextChannel } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { MESSAGES } from '../../util/constants';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class UnlockChannelCommand extends MinehutCommand {
	constructor() {
		super('unlock', {
			aliases: ['unlock'],
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['MANAGE_CHANNELS'],
			permissionLevel: PermissionLevel.Moderator,
			description: {
				content: 'Unlock a channel or a set of channels',
				usage: '[...channels] [-all]',
				examples: [
					'364502598805356545 412394499919052810',
					'-all',
					'412394499919052810 -all',
				],
			},
			args: [
				{
					id: 'channels',
					type: 'textChannel',
					match: 'separate',
					default: [],
				},
				{
					id: 'allChannels',
					match: 'flag',
					flag: '-all',
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ channels, allChannels }: { channels: TextChannel[]; allChannels: boolean }
	) {
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		const guildConfig = guildConfigs.get(msg.guild!.id);
		if (allChannels) {
			const channelLockdownConfig = guildConfig?.features.channelLockdown;
			if (!channelLockdownConfig)
				return msg.channel.send(
					`${process.env.EMOJI_CROSS} Cannot use flag \`-all\` as channel lockdown is not configured for this guild.`
				);
			for (const channel of channelLockdownConfig.channels) {
				if (!channels.some(c => c.id === channel)) {
					const resolvedChannel = this.client.channels.resolve(channel);
					if (resolvedChannel && resolvedChannel.type == 'text')
						channels.push(resolvedChannel as TextChannel);
				}
			}
		}
		if (channels.length == 0)
			return msg.channel.send(MESSAGES.commands.useHelp(prefix, 'unlock'));
		const unlockedChannels = [];
		for (const channel of channels) {
			if (
				channel.permissionOverwrites.some(
					permissionOverwrite =>
						permissionOverwrite.id === msg.guild!.roles.everyone.id &&
						permissionOverwrite.deny.equals(
							Permissions.FLAGS.SEND_MESSAGES + Permissions.FLAGS.ADD_REACTIONS
						)
				)
			) {
				await channel.overwritePermissions([
					...channel.permissionOverwrites.array(),
					{
						id: msg.guild!.roles.everyone,
						allow: ['SEND_MESSAGES', 'ADD_REACTIONS'],
					},
				]);
				unlockedChannels.push(channel);
			}
		}
		const differenceOfLengthAndUnlocked =
			channels.length - unlockedChannels.length;
		const m = await msg.channel.send(
			`${process.env.EMOJI_CHECK} unlocked **${unlockedChannels.length}** ${
				unlockedChannels.length == 1 ? 'channel' : 'channels'
			} ${
				differenceOfLengthAndUnlocked != 0
					? `(**${differenceOfLengthAndUnlocked}** ${
							differenceOfLengthAndUnlocked == 1 ? 'channel' : 'channels'
					  } already unlocked)`
					: ''
			}`
		);
		this.client.emit('channelUnlocked', msg.member!, unlockedChannels);
		if (channels.some(c => c.id === msg.channel.id)) {
			await msg.delete();
			setTimeout(async () => await m.delete(), 3000);
		}
	}
}
