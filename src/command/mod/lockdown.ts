import { PrefixSupplier } from 'discord-akairo';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { MESSAGES } from '../../util/constants';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class ChannelLockdownCommand extends MinehutCommand {
	constructor() {
		super('lockdown', {
			aliases: ['lockdown', 'lock'],
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['MANAGE_CHANNELS'],
			permissionLevel: PermissionLevel.Moderator,
			description: {
				content: 'Lockdown a channel or a set of channels (MUST USE QUOTES FOR REASON FLAG)',
				usage: '[...channels] [-all] [reason:""]',
				examples: [
					'364502598805356545 412394499919052810',
					'-all',
					'412394499919052810 -all',
					'-all reason:"Minehut is currently in maintenance!"',
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
				{
					id: 'reason',
					match: 'option',
					flag: 'reason:',
				},
			],
		});
	}

	async exec(
		msg: Message,
		{
			channels,
			allChannels,
			reason,
		}: { channels: TextChannel[]; allChannels: boolean; reason: string | null }
	) {
		reason;
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
		if (channels.length == 0 || channels.some(c => Array.isArray(c)))
			return msg.channel.send(MESSAGES.commands.useHelp(prefix, 'lockdown'));
		const lockedChannels = [];
		for (const channel of channels) {
			const permissions = channel.permissionsFor(msg.guild!.roles.everyone);
			if (permissions && permissions.toArray().includes('SEND_MESSAGES')) {
				await channel.updateOverwrite(
					msg.guild!.roles.everyone,
					{
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
					},
					`Channel lock from ${msg.author.tag}`
				);
				if (reason) {
					const embed = new MessageEmbed()
						.setTitle('This channel has been locked!')
						.setDescription(reason)
						.setColor('BLUE')
					channel.send(embed);
				}
				lockedChannels.push(channel);
			}
		}
		const differenceOfLengthAndLocked = channels.length - lockedChannels.length;
		const m = await msg.channel.send(
			`${process.env.EMOJI_CHECK} locked **${lockedChannels.length}** ${
				lockedChannels.length == 1 ? 'channel' : 'channels'
			} ${
				differenceOfLengthAndLocked != 0
					? `(**${differenceOfLengthAndLocked}** ${
							differenceOfLengthAndLocked == 1 ? 'channel' : 'channels'
					  } already locked)`
					: ''
			}`
		);
		this.client.emit('channelLocked', msg.member!, lockedChannels);
		if (channels.some(c => c.id === msg.channel.id)) {
			await msg.delete();
			setTimeout(async () => await m.delete(), 3000);
		}
	}
}
