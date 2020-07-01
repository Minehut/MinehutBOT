import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';
import { cloneDeep } from 'lodash';

export default class CaseSearchCommand extends MinehutCommand {
	constructor() {
		super('case-reason', {
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.JuniorModerator,
			description: {
				content: messages.commands.case.reason.description,
				usage: '<case> <...new reason>',
			},
			args: [
				{
					id: 'c',
					type: 'caseId',
					prompt: {
						start: (msg: Message) =>
							messages.commands.case.reason.casePrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.reason.casePrompt.retry(msg.author),
					},
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							messages.commands.case.reason.reasonPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.reason.reasonPrompt.retry(msg.author),
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
			messages.commands.case.reason.caseUpdated(c.id, reason.trim())
		);
	}
}
