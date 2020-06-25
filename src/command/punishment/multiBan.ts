import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { FOREVER_MS } from '../../util/constants';
import humanizeDuration from 'humanize-duration';
import { BanAction } from '../../structure/action/ban';
import { Argument } from 'discord-akairo';
import { User } from 'discord.js';

export default class MultiBanCommand extends MinehutCommand {
	constructor() {
		super('multiBan', {
			aliases: ['multiban', 'mban', 'bulkban'],
			permissionLevel: PermissionLevel.Moderator,
			category: 'punishment',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content: messages.commands.punishment.kick.description,
				usage: '"reason" <...members> [d:duration]',
			},
			args: [
				{
					id: 'reason',
					type: 'string',
				},
				{
					id: 'targets',
					type: Argument.union('user', async (msg, phrase) => {
						try {
							return await msg.client.users.fetch(phrase);
						} catch {
							return null;
						}
					}),
					match: 'separate',
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
			],
		});
	}

	async exec(
		msg: Message,
		{
			targets,
			reason,
			duration,
		}: { targets: User[]; reason: string; duration: number }
	) {
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3, round: true });
		const m = await msg.channel.send(
			messages.commands.punishment.multiBan.processing
		);
		const banned: { success: string[]; fail: string[] } = {
			success: [],
			fail: [],
		};
		targets.forEach(target => {
			const member = msg.guild!.member(target);
			if (member && !member.bannable) return banned.fail.push(target.id);
			const action = new BanAction({
				target,
				moderator: msg.member!,
				message: msg,
				reason: `(Multiban) ${reason}`,
				duration,
				client: this.client,
				guild: msg.guild!,
			});
			action.commit();
			banned.success.push(target.id);
		});
		m.edit(
			messages.commands.punishment.multiBan.done(banned, humanReadable, reason)
		);
	}
}
