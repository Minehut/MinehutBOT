import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/minehutCommand';

export default class TagCommand extends MinehutCommand {
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
				['tag-rename', 'rename'],

				['tag-listaliases', 'listaliases'],
				['tag-setalias', 'setalias'],
				['tag-deletealias', 'deletealias'],
				['tag-deletealias', 'delalias'],
			],
			otherwise: (msg: Message) => {
				const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
				return messages.commands.common.useHelp(prefix, this.aliases[0]);
			},
		};

		return Flag.continue(method);
	}
}
