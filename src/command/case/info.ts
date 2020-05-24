import { Message } from 'discord.js';
import { messages, emoji } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';
import { MessageEmbed } from 'discord.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);
const ago = new TimeAgo('en-US');

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
		const expiresTime = new Date(c.expiresAt).getTime();
		embed.addField(
			'Expires',
			expiresTime === -1
				? 'N/A'
				: `${c.expiresAt.getDate()}/${
						c.expiresAt.getMonth() + 1
				  }/${c.expiresAt.getFullYear()} ${c.expiresAt.toLocaleTimeString()} (${ago.format(
						c.expiresAt
				  )})`,
			true
		);
		embed.addField(
			'Date',
			`${c.createdAt.getDate()}/${
				c.createdAt.getMonth() + 1
			}/${c.createdAt.getFullYear()} ${c.createdAt.toLocaleTimeString()} (${ago.format(
				c.createdAt
			)})`,
			true
		);
		msg.channel.send(embed);
	}
}
