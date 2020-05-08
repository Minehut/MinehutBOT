import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/constant/messages';

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
				['tag-list', 'list'],
				['tag-info', 'info'],

				['tag-setalias', 'setalias'],
				['tag-deletealias', 'deletealias'],
				['tag-deletealias', 'delalias'],
			],
			otherwise: (_msg: Message) => {
				return messages.commands.common.useHelp(
					process.env.DISCORD_PREFIX!,
					this.aliases[0]
				);
			},
		};

		return Flag.continue(method);
	}
}
