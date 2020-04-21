import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import getPermissionLevel from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/PermissionLevel';
import { messages } from '../../util/constants/messages';

export default class PingCommand extends Command {
	constructor() {
		super('mylevel', {
			aliases: ['mylevel'],
			channel: 'guild',
			description: {
				content: messages.commands.myLevel.description,
			},
		});
	}

	async exec(msg: Message) {
		const permLevel = getPermissionLevel(msg.member!, this.client);
		msg.channel.send(
			messages.commands.myLevel.response(permLevel, PermissionLevel[permLevel])
		);
	}
}
