import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class PingCommand extends MinehutCommand {
	constructor() {
		super('ping', {
			aliases: ['ping'],
			category: 'utility',
			description: {
				content: messages.commands.ping.description,
			},
		});
	}

	async exec(msg: Message) {
		const m = await msg.channel.send(messages.commands.ping.responseLoading);
		m.edit(
			messages.commands.ping.responseFinished(
				m.createdTimestamp - msg.createdTimestamp,
				~~this.client.ws.ping
			)
		);
	}
}
