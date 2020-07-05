import { Message } from 'discord.js';
import { emoji } from '../../../util/messages';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { FOREVER_MS } from '../../../util/constants';
import humanizeDuration from 'humanize-duration';
import { BanAction } from '../../../structure/action/ban';
import { Argument } from 'discord-akairo';
import { User } from 'discord.js';

export default class MultiBanCommand extends MinehutCommand {
	constructor() {
		super('multiBan', {
			aliases: ['multiban', 'mban', 'massban', 'bulkban'],
			permissionLevel: PermissionLevel.Moderator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content: 'Ban multiple users at once',
				usage: '"reason" <...users> [d:duration] [days:number]',
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
						start: (msg: Message) => `${msg.author}, who do you want to ban?`,
						retry: (msg: Message) => `${msg.author}, please mention a user.`,
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
					id: 'days',
					type: 'number',
					match: 'option',
					flag: 'days:',
					default: 0,
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
			days,
		}: { targets: User[]; reason: string; duration: number; days: number }
	) {
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3, round: true });
		const m = await msg.channel.send(emoji.loading);
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
				reason: `(Multiban) ${reason}`,
				duration,
				client: this.client,
				guild: msg.guild!,
				days,
			});
			action.commit();
			banned.success.push(target.id);
		});
		m.edit(
			`${emoji.check} banned ${banned.success.length} members ${
				humanReadable !== 'permanent' ? `for **${humanReadable}** ` : ' '
			}(\`${reason}\`) ${
				banned.fail.length > 0
					? `[=> skipped ${banned.fail.length} members]`
					: ''
			}`
		);
	}
}
