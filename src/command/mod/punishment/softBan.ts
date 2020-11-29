import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { SoftBanAction } from '../../../structure/action/softBan';

export default class SoftBanCommand extends MinehutCommand {
	constructor() {
		super('softBan', {
			aliases: ['softban', 'sban'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			description: {
				content:
					'Bans a member, then immediately unbans them, deleting all of their messages up to 7 days old (TL;DR: kick with message deletion)',
				usage: '<member> [...reason]',
				examples: ['@daniel', '250536623270264833 bye bye (again)'],
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, who do you want to softban?`,
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
		if (!member.bannable)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} I cannot ban that member`
			);
		const action = new SoftBanAction({
			target: member,
			moderator: msg.member!,
			reason,
			guild: msg.guild!,
			client: this.client,
		});
		const c = await action.commit();
		msg.channel.send(
			`:hammer: softbanned ${action.target.user.tag} (\`${action.reason}\`) [${c?.id}]`
		);
	}
}
