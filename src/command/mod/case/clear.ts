import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { User } from 'discord.js';
import { Argument } from 'discord-akairo';
import { CaseModel } from '../../../model/case';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class CaseClearCommand extends MinehutCommand {
	constructor() {
		super('case-clear', {
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.SeniorModerator,
			description: {
				content: "Clear a user's punishment history",
				usage: '<user>',
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
							`${msg.author}, whose history do you want to clear?`,
						retry: (msg: Message) => `${msg.author}, please mention a user.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { target }: { target: User }) {
		const m = await msg.channel.send(process.env.EMOJI_LOADING!);
		await CaseModel.deleteMany({ targetId: target.id, active: false });
		m.edit(`${process.env.EMOJI_CHECK} cleared ${target.tag}'s case history`);
	}
}
