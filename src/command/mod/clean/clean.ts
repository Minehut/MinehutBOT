import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { MESSAGES } from '../../../util/constants';

export default class CleanCommand extends MinehutCommand {
	constructor() {
		super('clean', {
			aliases: ['clean', 'prune'],
			description: {
				content: `Clean messages
				Available subcommands:
				• **user** \`<user> <count>\`
				• **all** \`<count>\`
				• **bots** \`<count>\`
				`,
				usage: '<method> <...arguments>',
				examples: [
					'user @daniel 30',
					'user 99619143552077824 20',
					'all 70',
					'bots 10',
				],
			},
			permissionLevel: PermissionLevel.SuperHelper,
			category: 'mod',
			channel: 'guild',
		});
	}

	*args() {
		const method = yield {
			type: [
				['clean-user', 'user'],
				['clean-all', 'all'],
				['clean-bots', 'bots'],
			],
			otherwise: (msg: Message) => {
				const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
				return MESSAGES.commands.useHelp(prefix, this.aliases[0]);
			},
		};

		return Flag.continue(method);
	}
}
