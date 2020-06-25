import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import humanizeDuration from 'humanize-duration';
import { FOREVER_MS } from '../../util/constants';
import { BanAction } from '../../structure/action/ban';
import { Argument } from 'discord-akairo';
import { User } from 'discord.js';

export default class BanCommand extends MinehutCommand {
	constructor() {
		super('ban', {
			aliases: ['ban'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'punishment',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content: messages.commands.punishment.ban.description,
				usage: '<user> [...reason] [d:duration]',
			},
			args: [
				{
					id: 'target',
					type: Argument.union('user', async (msg, phrase) => {
						try {
							return await msg.client.users.fetch(phrase);
						} catch {
							return null;
						}
					}),
					prompt: {
						start: (msg: Message) =>
							messages.commands.punishment.ban.targetPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.punishment.ban.targetPrompt.retry(msg.author),
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
			target,
			reason,
			duration,
		}: { target: User; reason: string; duration: number }
	) {
		const member = msg.guild!.member(target);
		if (member && !member.bannable)
			return msg.channel.send(messages.commands.punishment.ban.notBannable);
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3 });
		const action = new BanAction({
			target,
			moderator: msg.member!,
			message: msg,
			reason,
			duration,
			client: this.client,
			guild: msg.guild!
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
