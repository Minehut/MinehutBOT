import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';
import { PrefixSupplier } from 'discord-akairo';

export default class CaseDeleteCommand extends MinehutCommand {
	constructor() {
		super('case-delete', {
			aliases: ['case-delete'],
			category: 'case',
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
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		if (c.deleted)
			return msg.channel.send(messages.commands.case.delete.alreadyDeleted);
		await c.updateOne({
			deleted: true,
			deletedBy: msg.author.id,
			active: false,
		});
		msg.channel.send(messages.commands.case.delete.caseDeleted(c.id));
	}
}
