import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';

export default class TagCommand extends Command {
	constructor() {
		super('tag', {
			aliases: ['tag'],
			description: {
				content: 'Manage tags',
				usage: '<method> <...arguments>',
			},
			category: 'tag',
			channel: 'guild'
		});
	}

	*args() {
		const method = yield {
			type: [
        ['tag-set', 'set'],
        ['tag-delete', 'delete']
			],
			otherwise: (_msg: Message) => {
				return 'todo: this message';
			},
		};

		return Flag.continue(method);
	}
}