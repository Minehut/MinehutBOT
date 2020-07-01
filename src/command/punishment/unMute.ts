// check if they're muted first

import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/guildConfigs';
import { UnMuteAction } from '../../structure/action/unMute';
import { CaseModel } from '../../model/case';
import { CaseType } from '../../util/constants';

export default class UnMuteCommand extends MinehutCommand {
	constructor() {
		super('unMute', {
			aliases: ['unmute'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'punishment',
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES'],
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
							messages.commands.punishment.unMute.memberPrompt.start(
								msg.author
							),
						retry: (msg: Message) =>
							messages.commands.punishment.unMute.memberPrompt.retry(
								msg.author
							),
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
		if (!member.manageable)
			return msg.channel.send(messages.commands.punishment.unMute.notUnMutable);
		if (!guildConfigs.get(msg.guild!.id)?.roles.muted)
			return msg.channel.send(messages.commands.punishment.mute.noMuteRole);
		if (
			!(await CaseModel.exists({
				targetId: member.id,
				type: CaseType.Mute,
				active: true,
				guildId: msg.guild!.id,
			}))
		)
			return msg.channel.send(messages.commands.punishment.unMute.notMuted);
		const action = new UnMuteAction({
			target: member,
			moderator: msg.member!,
			reason,
			client: this.client,
			guild: msg.guild!,
		});
		const c = await action.commit();
		msg.channel.send(
			messages.commands.punishment.unMute.unMuted(
				action.target,
				action.reason,
				c?.id
			)
		);
	}
}
