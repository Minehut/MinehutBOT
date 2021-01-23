import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../../model/case';
import { cloneDeep } from 'lodash';

export default class CaseSearchCommand extends MinehutCommand {
	constructor() {
		super('case-reason', {
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.SuperHelper,
			description: {
				content: 'Set a case reason',
				usage: '<case> <...new reason>',
			},
			args: [
				{
					id: 'c',
					type: 'caseId',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which case's reason do you want to change?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid case ID.`,
					},
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what do you want the case reason to be?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a case reason.`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ c, reason }: { c: DocumentType<Case>; reason: string }
	) {
		const oldCase = cloneDeep(c);
		c.reason = reason.trim();
		const newCase = c;
		await c.updateOne({ reason: c.reason });
		this.client.emit('caseUpdate', oldCase, newCase, msg.member!);
		msg.channel.send(
			`${process.env.EMOJI_CHECK} updated reason for case **${
				c.id
			}** (\`${c.reason.trim()}\`)`
		);
	}
}
