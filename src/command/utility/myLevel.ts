import { Message } from 'discord.js';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class PingCommand extends MinehutCommand {
	constructor() {
		super('myLevel', {
			aliases: ['mylevel'],
			channel: 'guild',
			category: 'utility',
			description: {
				content: 'Show your permission level',
			},
		});
	}

	async exec(msg: Message) {
		const permLevel = getPermissionLevel(msg.member!, this.client);
		msg.channel.send(
			`Your permission level is ${permLevel} (${PermissionLevel[permLevel]})`
		);
	}
}
