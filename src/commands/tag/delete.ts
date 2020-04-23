import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class TagDeleteCommand extends Command {
	constructor() {
		super('tag-delete', {
			aliases: ['tag-delete'],
		});
	}

	async exec(msg: Message) {
    return msg.reply('tag delete yo');
	}
}
