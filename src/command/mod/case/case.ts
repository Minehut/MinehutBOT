import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../../util/messages';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class CaseCommand extends MinehutCommand {
	constructor() {
		super('case', {
			aliases: ['case', 'infractions', 'infraction', 'inf', 'cases'],
			description: {
				content: `Manage cases.
				Available subcommands:
				• **clear** \`<user>\`
				• **delete** \`<case>\`
				• **duration** \`<case> <new duration>\`
				• **info** \`<case>\`
				• **search** \`<user>\`
				• **reason** \`<case> <...new reason>\`
				`,
				usage: '<method> <...arguments>',
				examples: [
					'clear @daniel',
					'clear 184474878840274946',
					'delete C4T5',
					'duration L33T 2d',
					'duration LEET 5years',
					'info JELL',
					'search @daniel',
					'search 250536623270264833',
					'reason AEST This is a better reason!',
				],
			},
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
		});
	}

	*args() {
		const method = yield {
			type: [
				['case-search', 'search'],
				['case-search', 'history'],

				['case-clear', 'clear'],
				['case-clear', 'wipe'],

				['case-reason', 'reason'],

				['case-info', 'info'],
				['case-info', 'lookup'],

				['case-duration', 'duration'],

				['case-delete', 'delete'],
				['case-delete', 'del'],
			],
			otherwise: (msg: Message) => {
				const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
				return messages.commands.common.useHelp(prefix, this.aliases[0]);
			},
		};

		return Flag.continue(method);
	}
}
