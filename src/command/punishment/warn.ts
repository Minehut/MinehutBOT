import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { WarnAction } from '../../structure/action/warn';

export default class WarnCommand extends MinehutCommand {
	constructor() {
		super('warn', {
			aliases: ['warn'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'punishment',
			channel: 'guild',
			description: {
				content: messages.commands.punishment.warn.description,
				usage: '<member> <...reason>',
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							messages.commands.punishment.warn.memberPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.punishment.warn.memberPrompt.retry(msg.author),
					},
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							messages.commands.punishment.warn.reasonPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.punishment.warn.reasonPrompt.retry(msg.author),
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ member, reason }: { member: GuildMember; reason: string }
	) {
		const action = new WarnAction({
			target: member,
			moderator: msg.member!,
			guild: msg.guild!,
			client: this.client,
			reason,
		});
		action.commit();
		msg.channel.send(
			messages.commands.punishment.warn.warned(action.target, action.reason)
		);
	}
}
