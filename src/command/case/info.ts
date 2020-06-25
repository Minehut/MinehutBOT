import { Message } from 'discord.js';
import { messages, emoji } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';
import { MessageEmbed } from 'discord.js';
import { prettyDate } from '../../util/util';

export default class CaseInfoCommand extends MinehutCommand {
	constructor() {
		super('case-info', {
			aliases: ['case-info'],
			category: 'case',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			permissionLevel: PermissionLevel.JuniorModerator,
			description: {
				content: messages.commands.case.info.description,
				usage: '<case>',
			},
			args: [
				{
					id: 'c',
					type: 'caseId',
					prompt: {
						start: (msg: Message) =>
							messages.commands.case.info.casePrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.info.casePrompt.retry(msg.author),
					},
				},
			],
		});
	}

	async exec(msg: Message, { c }: { c: DocumentType<Case> }) {
		// ID, Active, Moderator, Target, Expires, Reason, Type, Date
		const embed = new MessageEmbed();
		embed.setTitle(`Information for case #${c.id}`);
		embed.setColor(c.active ? 'GREEN' : 'RED');
		embed.addField(
			'Active?',
			`${!c.active ? `${emoji.inactive} Inactive` : `${emoji.active} Active`}`
		);
		embed.addField('Moderator', `${c.moderatorTag} (${c.moderatorId})`, true);
		embed.addField('Target', `${c.targetTag} (${c.targetId})`, true);
		embed.addField('Reason', c.reason, true);
		embed.addField(
			'Type',
			c.type.toLowerCase().charAt(0).toUpperCase() +
				c.type.toLowerCase().slice(1),
			true
		);
		embed.addField('Expires', prettyDate(c.expiresAt), true);
		embed.addField('Date', prettyDate(c.createdAt), true);
		msg.channel.send(embed);
	}
}