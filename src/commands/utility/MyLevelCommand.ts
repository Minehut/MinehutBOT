import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import getPermissionLevel from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/PermissionLevel';

export default class PingCommand extends Command {
	constructor() {
		super('mylevel', {
      aliases: ['mylevel'],
      channel: 'guild'
		});
	}

	async exec(msg: Message) {
    const permLevel = getPermissionLevel(msg.member!, this.client);
		msg.channel.send(`Your permission level is ${permLevel} (${PermissionLevel[permLevel]})`);
	}
}
