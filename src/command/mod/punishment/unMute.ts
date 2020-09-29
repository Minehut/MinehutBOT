import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../../guild/config/guildConfigs';
import { UnMuteAction } from '../../../structure/action/unMute';
import { CaseModel } from '../../../model/case';
import { CaseType } from '../../../util/constants';

export default class UnMuteCommand extends MinehutCommand {
	constructor() {
		super('unMute', {
			aliases: ['unmute'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES'],
			description: {
				content: 'Unmute a member',
				usage: '<member> [...reason]',
				examples: ['296275116889866240 cool person'],
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, who do you want to unmute?`,
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
		if (!member.manageable)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} I cannot unmute that member`
			);
		if (!guildConfigs.get(msg.guild!.id)?.roles.muted)
			throw new Error('No mute role set in config');
		if (
			!(await CaseModel.exists({
				targetId: member.id,
				type: CaseType.Mute,
				active: true,
				guild: msg.guild!.id,
			}))
		)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} this member is not currently muted`
			);
		const action = new UnMuteAction({
			target: member,
			moderator: msg.member!,
			reason,
			client: this.client,
			guild: msg.guild!,
		});
		const c = await action.commit();
		msg.channel.send(
			`:ok_hand: unmuted ${action.target.user.tag} (\`${action.reason}\`) [${c?.id}]`
		);
	}
}
