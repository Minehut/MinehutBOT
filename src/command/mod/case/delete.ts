import { Message } from 'discord.js';
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
				content: 'Delete a case',
				usage: '<case>',
			},
			args: [
				{
					id: 'c',
					type: 'caseId',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which case do you want to delete?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid case ID.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { c }: { c: DocumentType<Case> }) {
		if (c.active)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} cannot delete an active case`
			);
		await c.remove();
		this.client.emit('caseDelete', c, msg.member!);
		msg.channel.send(`${process.env.EMOJI_CHECK} deleted case #${c.id}`);
	}
}
