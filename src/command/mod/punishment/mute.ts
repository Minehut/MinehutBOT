import { Message } from 'discord.js';
import { emoji } from '../../../util/messages';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import humanizeDuration from 'humanize-duration';
import { FOREVER_MS } from '../../../util/constants';
import { MuteAction } from '../../../structure/action/mute';
import { guildConfigs } from '../../../guild/config/guildConfigs';

export default class MuteCommand extends MinehutCommand {
	constructor() {
		super('mute', {
			aliases: ['mute'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES'],
			description: {
				content: 'Mute a member for specified duration (defaults to permanent)',
				usage: '<user> [...reason] [d:duration]',
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) => `${msg.author}, who do you want to mute?`,
						retry: (msg: Message) => `${msg.author}, please mention a member.`,
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
		if (!member.manageable)
			return msg.channel.send(`${emoji.cross} I cannot mute that member`);
		if (!guildConfigs.get(msg.guild!.id)?.roles.muted)
			throw new Error('No mute role set in config');
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3, round: true });
		const action = new MuteAction({
			target: member,
			moderator: msg.member!,
			guild: msg.guild!,
			reason,
			duration,
			client: this.client,
		});
		const c = await action.commit();
		msg.channel.send(
			`:zipper_mouth: muted ${action.target.user.tag}${
				humanReadable !== 'permanent' ? ` for **${humanReadable}** ` : ' '
			}(\`${reason}\`) [${c?.id}]`
		);
	}
}
