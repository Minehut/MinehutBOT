import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';
import { guildConfigs } from '../guild/config/guildConfigs';
import { MinehutCommand } from '../structure/command/minehutCommand';

export default class BlockedChannelInhibitor extends Inhibitor {
	constructor() {
		super('blockedChannel', {
			reason: 'Channel is blocked in guild configuration',
		});
	}

	exec(msg: Message, command: MinehutCommand) {
		if (msg.guild) {
			const blockedChannelsConfiguration = guildConfigs.get(msg.guild.id)
				?.features.commands?.blockedChannels;
			if (blockedChannelsConfiguration) {
				const blockedChannel = blockedChannelsConfiguration.find(
					v => v.channel === msg.channel.id
				);
				if (blockedChannel)
					return !blockedChannel.whitelistedCommandCategories?.includes(
						command.categoryID
					);
			}
			return false;
		} else return false;
	}
}
