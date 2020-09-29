import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { KickAction } from '../../../structure/action/kick';

export default class KickCommand extends MinehutCommand {
	constructor() {
		super('kick', {
			aliases: ['kick'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['KICK_MEMBERS'],
			description: {
				content: 'Kick a member',
				usage: '<member> [...reason]',
				examples: ['@daniel', '250536623270264833 bye bye'],
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) => `${msg.author}, who do you want to kick?`,
						retry: (msg: Message) => `${msg.author}, please mention a member.`,
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
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} I cannot kick that member`
			);
		const action = new KickAction({
			target: member,
			moderator: msg.member!,
			reason,
			guild: msg.guild!,
			client: this.client,
		});
		const c = await action.commit();
		msg.channel.send(
			`:boot: kicked ${action.target.user.tag} (\`${action.reason}\`) [${c?.id}]`
		);
	}
}
