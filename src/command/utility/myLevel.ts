import { Message } from 'discord.js';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class PingCommand extends MinehutCommand {
	constructor() {
		super('mylevel', {
			aliases: ['mylevel'],
			channel: 'guild',
			category: 'utility',
			description: {
				content: messages.commands.utility.myLevel.description,
			},
		});
	}

	async exec(msg: Message) {
		const permLevel = getPermissionLevel(msg.member!, this.client);
		msg.channel.send(
			messages.commands.utility.myLevel.response(
				permLevel,
				PermissionLevel[permLevel]
			)
		);
	}
}
