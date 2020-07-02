import { Message } from 'discord.js';
import { messages } from '../../../util/messages';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../../model/case';
import { prettyDate } from '../../../util/util';
import { FOREVER_MS } from '../../../util/constants';
import humanizeDuration from 'humanize-duration';
import { cloneDeep } from 'lodash';

export default class CaseDurationCommand extends MinehutCommand {
	constructor() {
		super('case-duration', {
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.JuniorModerator,
			description: {
				content: messages.commands.case.duration.description,
				usage: '<case> <new duration>',
			},
			args: [
				{
					id: 'c',
					type: 'caseId',
					prompt: {
						start: (msg: Message) =>
							messages.commands.case.duration.casePrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.duration.casePrompt.retry(msg.author),
					},
				},
				{
					id: 'duration',
					type: 'duration',
					prompt: {
						start: (msg: Message) =>
							messages.commands.case.duration.durationPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.duration.durationPrompt.retry(msg.author),
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ c, duration }: { c: DocumentType<Case>; duration: number }
	) {
		if (!c.active)
			return msg.channel.send(messages.commands.case.duration.alreadyExpired);

		const oldCase = cloneDeep(c);
		const newExpiry = new Date(c.createdAt).getTime() + duration;
		c.expiresAt = new Date(newExpiry);
		await c.updateOne(c);

		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3, round: true });

		this.client.emit('caseUpdate', oldCase, c, msg.member!);

		this.client.banScheduler.refresh();
		this.client.muteScheduler.refresh();

		return msg.channel.send(
			messages.commands.case.duration.caseUpdated(
				c._id,
				humanReadable,
				prettyDate(new Date(newExpiry))
			)
		);
	}
}
