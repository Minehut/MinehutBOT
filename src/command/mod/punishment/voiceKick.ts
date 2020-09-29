import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { VoiceKickAction } from '../../../structure/action/voiceKick';

export default class VoiceKickCommand extends MinehutCommand {
	constructor() {
		super('voiceKick', {
			aliases: ['voicekick', 'vckick', 'vkick'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['MOVE_MEMBERS'],
			description: {
				content:
					"Kick a member from their voice channel (shows on record as opposed to 'Disconnect' button)",
				usage: '<member> [...reason]',
				examples: ['@Trent using a voice changer'],
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, who do you want to voicekick?`,
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
		if (!member.voice.channel)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} user is not in a voice channel`
			);
		const action = new VoiceKickAction({
			target: member,
			moderator: msg.member!,
			client: this.client,
			guild: msg.guild!,
			reason,
		});
		const c = await action.commit();
		msg.channel.send(
			`:boot: kicked ${action.target.user.tag} from their voice channel (\`${action.reason}\`) [${c?.id}]`
		);
	}
}
