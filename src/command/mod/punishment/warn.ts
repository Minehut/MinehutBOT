import { Message } from 'discord.js';
import { emoji } from '../../../util/messages';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { WarnAction } from '../../../structure/action/warn';

export default class WarnCommand extends MinehutCommand {
	constructor() {
		super('warn', {
			aliases: ['warn'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			description: {
				content: 'Warn a member',
				usage: '<member> <...reason>',
				examples: ['@daniel Channel Misuse', '74881710235320320 Spam'],
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) => `${msg.author}, who do you want to warn?`,
						retry: (msg: Message) => `${msg.author}, please mention a member.`,
					},
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what is the reason for the warning?`,
						retry: (msg: Message) => `${msg.author}, please include a reason.`,
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
		const c = await action.commit();
		msg.channel.send(
			`${emoji.warning} warned ${action.target.user.tag} for \`${action.reason}\` [${c?.id}]`
		);
	}
}
