import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class CaseCommand extends MinehutCommand {
	constructor() {
		super('case', {
			aliases: ['case', 'infractions', 'infraction', 'inf', 'cases'],
			description: {
				content: messages.commands.case.description,
				usage: '<method> <...arguments>',
			},
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'case',
			channel: 'guild',
		});
	}

	*args() {
		const method = yield {
			type: [
				['case-search', 'search'],
				['case-reason', 'reason'],
				['case-info', 'info'],
				['case-info', 'lookup'],
			],
			otherwise: (msg: Message) => {
				const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
				return messages.commands.common.useHelp(prefix, this.aliases[0]);
			},
		};

		return Flag.continue(method);
	}
}
