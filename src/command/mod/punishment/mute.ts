import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import humanizeDuration from 'humanize-duration';
import { FOREVER_MS, MESSAGES } from '../../../util/constants';
import { MuteAction } from '../../../structure/action/mute';
import { guildConfigs } from '../../../guild/config/guildConfigs';
import { PrefixSupplier } from 'discord-akairo';

export default class MuteCommand extends MinehutCommand {
	constructor() {
		super('mute', {
			aliases: ['mute'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES'],
			description: {
				content: 'Mute a member for specified duration',
				usage: '<user> <duration> [...reason]',
				examples: [
					'@daniel 6h Swearing!',
					'161984544205963264 forever',
					'250536623270264833 p very long mute',
					'@ZeroParticle 2w',
				],
			},
			args: [
				{
					id: 'member',
					type: 'member',
				},
				{
					id: 'duration',
					type: 'duration',
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
		{
			member,
			reason,
			duration,
		}: { member?: GuildMember; reason: string; duration: number | null }
	) {
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		if (!member || !duration)
			return msg.channel.send(MESSAGES.commands.useHelp(prefix, 'mute'));
		if (!member.manageable)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} I cannot mute that member`
			);
		if (!guildConfigs.get(msg.guild!.id)?.roles.muted)
			throw new Error('No mute role set in config');
		const humanReadable =
			duration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(duration, { largest: 3, round: true });
		const action = new MuteAction({
			target: member,
			moderator: msg.member!,
			guild: msg.guild!,
			reason,
			duration,
			client: this.client,
		});
		const c = await action.commit();
		msg.channel.send(
			`:zipper_mouth: muted ${action.target.user.tag}${
				humanReadable !== 'permanent' ? ` for **${humanReadable}** ` : ' '
			}(\`${action.reason}\`) [${c?.id}]`
		);
	}
}
