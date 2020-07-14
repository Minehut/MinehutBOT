import { Message } from 'discord.js';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class ErrorCommand extends MinehutCommand {
	constructor() {
		super('error', {
			aliases: ['error'],
			category: 'utility',
			description: {
				content: 'Throw an error',
			},
			ownerOnly: true,
		});
	}

	async exec(msg: Message) {
		msg.react('👌');
		throw new Error('This is an error from the error command');
	}
}
