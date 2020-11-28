import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';

export default class AutoReactMessageListener extends Listener {
	constructor() {
		super('autoReactMessage', {
			emitter: 'client',
			event: 'message',
		});
	}

	async exec(msg: Message) {
		if (!msg.guild) return;
		const autoReactConfig = guildConfigs.get(msg.guild.id)?.features.autoReact;
		if (!autoReactConfig || !autoReactConfig.channels) return;
		const autoReactChannel = autoReactConfig.channels.find(
			c => c.channel === msg.channel.id
		);
		if (!autoReactChannel) return;
		autoReactChannel.reactions.forEach(async r => await msg.react(r));
	}
}
