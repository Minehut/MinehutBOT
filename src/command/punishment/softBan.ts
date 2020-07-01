import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { SoftBanAction } from '../../structure/action/softBan';

export default class SoftBanCommand extends MinehutCommand {
	constructor() {
		super('softban', {
			aliases: ['softban', 'sban'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'punishment',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content: messages.commands.punishment.softBan.description,
				usage: '<member> [...reason]',
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							messages.commands.punishment.softBan.memberPrompt.start(
								msg.author
							),
						retry: (msg: Message) =>
							messages.commands.punishment.softBan.memberPrompt.retry(
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
		if (!member.bannable)
			return msg.channel.send(messages.commands.punishment.softBan.notBannable);
		const action = new SoftBanAction({
			target: member,
			moderator: msg.member!,
			reason,
			guild: msg.guild!,
			client: this.client,
		});
		const c = await action.commit();
		msg.channel.send(
			messages.commands.punishment.softBan.softBanned(
				action.target,
				action.reason,
				c?.id
			)
		);
	}
}
