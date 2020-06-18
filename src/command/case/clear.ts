import { Message } from 'discord.js';
import { messages, emoji } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { User } from 'discord.js';
import { Argument } from 'discord-akairo';
import { CaseModel } from '../../model/case';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class CaseClearCommand extends MinehutCommand {
	constructor() {
		super('case-clear', {
			aliases: ['case-clear'],
			category: 'case',
			channel: 'guild',
			permissionLevel: PermissionLevel.SeniorModerator,
			description: {
				content: messages.commands.case.clear.description,
				usage: '<target>',
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
							messages.commands.case.clear.targetPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.clear.targetPrompt.retry(msg.author),
					},
				},
			],
		});
	}

	async exec(msg: Message, { target }: { target: User }) {
		const m = await msg.channel.send(emoji.loading);
		await CaseModel.deleteMany({ targetId: target.id, active: false });
		m.edit(messages.commands.case.clear.clearedHistory(target));
	}
}
