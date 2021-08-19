import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import humanizeDuration from 'humanize-duration';
import { FOREVER_MS, MESSAGES } from '../../../util/constants';
import { BanAction } from '../../../structure/action/ban';
import { Argument } from 'discord-akairo';
import { User } from 'discord.js';
import { PrefixSupplier } from 'discord-akairo';

export default class BanCommand extends MinehutCommand {
	constructor() {
		super('ban', {
			aliases: ['ban'],
			permissionLevel: PermissionLevel.SuperHelper,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content:
					'Ban a user for specified duration, days arg = how many messages should be deleted',
				usage: '<user> <duration> [...reason] [days:number]',
				examples: [
					'@daniel',
					'74881710235320320 p too cool to be here',
					'@Trent 1y suspicious',
					'201345371513946112 1h',
					'@daniel 2w delete this! days:1',
				],
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
				},
				{
					id: 'duration',
					type: 'duration',
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
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
			target,
			reason,
			duration,
			days,
		}: {
			target: User | null;
			reason: string;
			duration: number | null;
			days: number;
		}
	) {
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		if (!target || !duration)
			return msg.channel.send(MESSAGES.commands.useHelp(prefix, 'ban'));
		const member = msg.guild!.members.resolve(target);
		if (member && !member.bannable)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} I cannot ban that user`
			);
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3, round: true });
		const action = new BanAction({
			target,
			moderator: msg.member!,
			reason,
			duration,
			client: this.client,
			guild: msg.guild!,
			days,
		});
		const c = await action.commit();
		msg.channel.send(
			`:hammer: banned ${target.tag}${
				humanReadable !== 'permanent' ? ` for **${humanReadable}** ` : ' '
			}(\`${action.reason}\`) [${c?.id}]`
		);
	}
}
