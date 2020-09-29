import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../../model/case';
import { prettyDate } from '../../../util/functions';
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
				content: 'Set a case duration',
				usage: '<case> <new duration>',
			},
			args: [
				{
					id: 'c',
					type: 'caseId',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which case's duration do you want to change?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid case ID.`,
					},
				},
				{
					id: 'duration',
					type: 'duration',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what do you want the case duration to be?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a case duration.`,
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
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} case has already expired`
			);

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

		msg.channel.send(
			`${process.env.EMOJI_CHECK} case **${c.id}** is now ${
				humanReadable === 'permanent' ? 'permanent' : `${humanReadable} long`
			} (expires: ${prettyDate(new Date(newExpiry))})`
		);
	}
}
