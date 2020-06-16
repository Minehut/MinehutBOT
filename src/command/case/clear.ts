import { Message } from 'discord.js';
import { messages } from '../../util/messages';
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
							messages.commands.case.search.targetPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.search.targetPrompt.retry(msg.author),
					},
				},
			],
		});
	}

	async exec(msg: Message, { target }: { target: User }) {
		let cases = await CaseModel.find({
			targetId: target.id,
			guildId: msg.guild!.id,
			deleted: false,
		});
		console.log(cases);
		if (cases.length < 1)
			return msg.channel.send(messages.commands.case.search.emptyHistory);
		await CaseModel.updateMany(
			{ targetId: target.id, guildId: msg.guild!.id, deleted: false },
			{ deleted: true, deletedBy: msg.author.id, active: false }
		);
		msg.channel.send(messages.commands.case.clear.clearedHistory(target));
	}
}
