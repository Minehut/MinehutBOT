import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../../model/case';
import { MessageEmbed } from 'discord.js';
import { prettyDate } from '../../../util/functions';
import { FOREVER_MS } from '../../../util/constants';
import humanizeDuration from 'humanize-duration';

export default class CaseInfoCommand extends MinehutCommand {
	constructor() {
		super('case-info', {
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			permissionLevel: PermissionLevel.JuniorModerator,
			description: {
				content: 'Lookup a specific case',
				usage: '<case>',
			},
			args: [
				{
					id: 'c',
					type: 'caseId',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which case do you want to lookup?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid case ID.`,
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
		if (c.expiresAt.getTime() > -1) {
			const duration = c.expiresAt.getTime() - c.createdAt.getTime();
			embed.addField(
				'Duration',
				`${
					duration === FOREVER_MS
						? 'Forever'
						: humanizeDuration(duration, { largest: 3, round: true })
				}`,
				true
			);
		}
		embed.addField('Date', prettyDate(c.createdAt), true);
		msg.channel.send(embed);
	}
}
