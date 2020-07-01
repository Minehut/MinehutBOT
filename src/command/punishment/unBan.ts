import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { CaseModel } from '../../model/case';
import { CaseType } from '../../util/constants';
import { Argument } from 'discord-akairo';
import { User } from 'discord.js';
import { UnBanAction } from '../../structure/action/unBan';

export default class UnBanCommand extends MinehutCommand {
	constructor() {
		super('unBan', {
			aliases: ['unban'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'punishment',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content: messages.commands.punishment.kick.description,
				usage: '<member> [...reason]',
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
						start: (msg: Message) =>
							messages.commands.punishment.unBan.targetPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.punishment.unBan.targetPrompt.retry(msg.author),
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
		{ target, reason }: { target: User; reason: string }
	) {
		if (
			!(await CaseModel.exists({
				targetId: target.id,
				$or: [{ type: CaseType.Ban }, { type: CaseType.ForceBan }],
				active: true,
				guildId: msg.guild!.id,
			}))
		)
			return msg.channel.send(messages.commands.punishment.unBan.notBanned);
		const action = new UnBanAction({
			target: target,
			moderator: msg.member!,
			reason,
			client: this.client,
			guild: msg.guild!,
		});
		const c = await action.commit();
		msg.channel.send(
			messages.commands.punishment.unBan.unBanned(
				action.target,
				action.reason,
				c?.id
			)
		);
	}
}
