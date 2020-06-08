import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import humanizeDuration from 'humanize-duration';
import { FOREVER_MS } from '../../util/constants';
import { BanAction } from '../../structure/action/ban';

export default class BanCommand extends MinehutCommand {
	constructor() {
		super('ban', {
			aliases: ['ban', 'tempban'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'punishment',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content: messages.commands.punishment.ban.description,
				usage: '<member> [duration] [...reason]',
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							messages.commands.punishment.ban.memberPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.punishment.ban.memberPrompt.retry(msg.author),
					},
				},
				{
					id: 'duration',
					type: 'duration',
					match: 'option',
					flag: ['duration', 'd', 'l'],
					default: FOREVER_MS,
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
				},
			],
		});
	}

	async exec(
		msg: Message,
		{
			member,
			reason,
			duration,
		}: { member: GuildMember; reason: string; duration: number }
	) {
		if (!member.bannable)
			return msg.channel.send(messages.commands.punishment.ban.notBannable);
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3 });
		const action = new BanAction({
			target: member,
			moderator: msg.member!,
			message: msg,
			reason,
			duration,
			client: this.client,
		});
		action.commit();
		msg.channel.send(
			messages.commands.punishment.ban.banned(
				action.target,
				action.reason,
				humanReadable
			)
		);
	}
}
