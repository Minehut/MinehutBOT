import { Message } from 'discord.js';
import { messages } from '../../../util/messages';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../../model/case';

export default class CaseDeleteCommand extends MinehutCommand {
	constructor() {
		super('case-delete', {
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.Moderator,
			description: {
				content: messages.commands.case.delete.description,
				usage: '<case>',
			},
			args: [
				{
					id: 'c',
					type: 'caseId',
					prompt: {
						start: (msg: Message) =>
							messages.commands.case.delete.casePrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.delete.casePrompt.retry(msg.author),
					},
				},
			],
		});
	}

	async exec(msg: Message, { c }: { c: DocumentType<Case> }) {
		if (c.active) return msg.channel.send(messages.commands.case.delete.caseActive);
		await c.remove();
		this.client.emit('caseDelete', c, msg.member!);
		msg.channel.send(messages.commands.case.delete.caseDeleted(c.id));
	}
}
