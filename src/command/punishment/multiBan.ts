import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { FOREVER_MS } from '../../util/constants';
import humanizeDuration from 'humanize-duration';
import { BanAction } from '../../structure/action/ban';

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
					id: 'members',
					type: 'member',
					match: 'separate',
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
			],
		});
	}

	async exec(
		msg: Message,
		{
			members,
			reason,
			duration,
		}: { members: GuildMember[]; reason: string; duration: number }
	) {
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3 });
		const m = await msg.channel.send(
			messages.commands.punishment.multiBan.processing
		);
		const banned: { success: string[]; fail: string[] } = {
			success: [],
			fail: [],
		};
		members.forEach(member => {
			if (!member.bannable) return banned.fail.push(member.id);
			const action = new BanAction({
				target: member,
				moderator: msg.member!,
				message: msg,
				reason: `(Multiban) ${reason}`,
				duration,
				client: this.client,
			});
			action.commit();
			banned.success.push(member.id);
		});
		m.edit(
			messages.commands.punishment.multiBan.done(
				banned,
				humanReadable,
				reason
			)
		);
	}
}
