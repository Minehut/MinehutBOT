import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { KickAction } from '../../structure/action/kick';

export default class KickCommand extends MinehutCommand {
	constructor() {
		super('kick', {
			aliases: ['kick'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'punishment',
			channel: 'guild',
			clientPermissions: ['KICK_MEMBERS'],
			description: {
				content: messages.commands.punishment.kick.description,
				usage: '<member> [...reason]',
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							messages.commands.punishment.kick.memberPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.punishment.kick.memberPrompt.retry(msg.author),
					},
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
		{ member, reason }: { member: GuildMember; reason: string }
	) {
		if (!member.kickable)
			return msg.channel.send(messages.commands.punishment.kick.notKickable);
		const action = new KickAction({
			target: member,
			moderator: msg.member!,
			message: msg,
			reason,
		});
		action.commit();
		msg.channel.send(
			messages.commands.punishment.kick.kicked(action.target, action.reason)
		);
	}
}
