import { Message } from 'discord.js';
import { emoji } from '../../../util/messages';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import humanizeDuration from 'humanize-duration';
import { FOREVER_MS } from '../../../util/constants';
import { BanAction } from '../../../structure/action/ban';
import { Argument } from 'discord-akairo';
import { User } from 'discord.js';

export default class BanCommand extends MinehutCommand {
	constructor() {
		super('ban', {
			aliases: ['ban'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content:
					'Ban a user for specified duration (defaults to permanent), days arg = how many messages should be deleted',
				usage: '<user> [...reason] [d:duration] [days:number]',
				examples: [
					'@daniel',
					'74881710235320320 too cool to be here',
					'@Trent suspicious d:1y',
					'201345371513946112 d:1h',
					'@daniel delete this! days:1 d:2w',
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
					prompt: {
						start: (msg: Message) => `${msg.author}, who do you want to ban?`,
						retry: (msg: Message) => `${msg.author}, please mention a user.`,
					},
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
				},
				{
					id: 'duration',
					type: 'duration',
					match: 'option',
					flag: ['duration:', 'd:', 'l:'],
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
			target,
			reason,
			duration,
			days,
		}: { target: User; reason: string; duration: number; days: number }
	) {
		console.log(days);
		const member = msg.guild!.member(target);
		if (member && !member.bannable)
			return msg.channel.send(`${emoji.cross} I cannot ban that user`);
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
