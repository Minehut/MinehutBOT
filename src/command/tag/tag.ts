import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { MESSAGES } from '../../util/constants';

export default class TagCommand extends MinehutCommand {
	constructor() {
		super('tag', {
			aliases: ['tag'],
			description: {
				content: `Manage tags.
				Available subcommands:
				• **show** \`<name/alias>\`
				• **set** \`<name> <content>\`
				• **setalias** \`<alias> <target>\`
				• **listaliases**
				• **deletealias** \`<alias>\`
				• **info** \`<name/alias>\`
				• **source** \`<name/alias>\`
				• **list**
				• **rename** \`<old name> <new name>\`
				• **delete** \`<name>\`
				* **setsection** \`<name> <section>\`
				`,
				usage: '<method> <...arguments>',
				examples: [
					'show meta',
					'set informative minehut :point_right: If you want a great server host, use minehut.com',
					'setalias mh minehut',
					'deletealias mh',
					'info minehut',
					'info mh',
					'source timings',
					'rename minehut memehut',
					'delete memehut',
					'setsection minehut useful',
				],
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
				['tag-delete', 'del'],

				['tag-show', 'show'],
				['tag-list', 'list'],
				['tag-info', 'info'],
				['tag-rename', 'rename'],
				['tag-source', 'source'],

				['tag-listaliases', 'listaliases'],
				['tag-setalias', 'setalias'],
				['tag-deletealias', 'deletealias'],
				['tag-deletealias', 'delalias'],

				['tag-setsection', 'setsection']
			],
			otherwise: (msg: Message) => {
				const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
				return MESSAGES.commands.useHelp(prefix, this.aliases[0]);
			},
		};

		return Flag.continue(method);
	}
}
