import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';
import { guildConfigs } from '../guild/config/guildConfigs';

export default class BlockedChannelInhibitor extends Inhibitor {
	constructor() {
		super('blockedChannel', {
			reason: 'Channel is blocked in guild configuration',
		});
	}

	exec(msg: Message) {
		if (msg.guild) {
			const blockedChannelsConfiguration = guildConfigs.get(msg.guild.id)
				?.features.commands?.blockedChannels;
			if (blockedChannelsConfiguration)
				return blockedChannelsConfiguration.includes(msg.channel.id);
			return false;
		} else return false;
	}
}
