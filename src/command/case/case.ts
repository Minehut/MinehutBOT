import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class CaseCommand extends MinehutCommand {
	constructor() {
		super('case', {
			aliases: ['case', 'infractions', 'infraction', 'inf', 'cases'],
			description: {
				content: 'Manage cases',
				usage: '<method> <...arguments>',
			},
			category: 'case',
			channel: 'guild',
		});
	}

	*args() {
		const method = yield {
			type: [['case-search', 'search']],
			otherwise: (msg: Message) => {
				const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
				return messages.commands.common.useHelp(prefix, this.aliases[0]);
			},
		};

		return Flag.continue(method);
	}
}
