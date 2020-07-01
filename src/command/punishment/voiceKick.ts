import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { GuildMember } from 'discord.js';
import { VoiceKickAction } from '../../structure/action/voiceKick';

export default class VoiceKickCommand extends MinehutCommand {
	constructor() {
		super('voiceKick', {
			aliases: ['voicekick', 'vckick', 'vkick'],
			permissionLevel: PermissionLevel.JuniorModerator,
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['MOVE_MEMBERS'],
			description: {
				content: messages.commands.punishment.voiceKick.description,
				usage: '<member> [...reason]',
			},
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							messages.commands.punishment.voiceKick.memberPrompt.start(
								msg.author
							),
						retry: (msg: Message) =>
							messages.commands.punishment.voiceKick.memberPrompt.retry(
								msg.author
							),
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
				messages.commands.punishment.voiceKick.notInVoice
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
			messages.commands.punishment.voiceKick.kicked(
				action.target,
				action.reason,
				c?.id
			)
		);
	}
}
