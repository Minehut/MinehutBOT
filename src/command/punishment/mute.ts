import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import humanizeDuration from 'humanize-duration';
import { FOREVER_MS } from '../../util/constants';
import { MuteAction } from '../../structure/action/mute';
import { guildConfigs } from '../../guild/guildConfigs';

export default class MuteCommand extends MinehutCommand {
	constructor() {
		super('mute', {
			aliases: ['mute'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'punishment',
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES'],
			description: {
				content: messages.commands.punishment.kick.description,
				usage: '<user> [...reason] [d:duration]',
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							messages.commands.punishment.mute.memberPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.punishment.mute.memberPrompt.retry(msg.author),
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
			return msg.channel.send(messages.commands.punishment.mute.notMutable);
		if (!guildConfigs.get(msg.guild!.id)?.roles.muted)
			return msg.channel.send(messages.commands.punishment.mute.noMuteRole);
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3, round: true });
		const action = new MuteAction({
			target: member,
			moderator: msg.member!,
			message: msg,
			reason,
			duration,
			client: this.client,
		});
		action.commit();
		msg.channel.send(
			messages.commands.punishment.mute.muted(
				action.target,
				action.reason,
				humanReadable
			)
		);
	}
}
