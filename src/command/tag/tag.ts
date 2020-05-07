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
			channel: 'guild',
		});
	}

	*args() {
		const method = yield {
			type: [
				['tag-set', 'set'],
				['tag-delete', 'delete'],
				['tag-show', 'show'],

				['tag-setalias', 'setalias'],
				['tag-deletealias', 'deletealias'],
				['tag-deletealias', 'delalias'],
			],
			otherwise: (_msg: Message) => {
				return 'todo: this message';
			},
		};

		return Flag.continue(method);
	}
}
