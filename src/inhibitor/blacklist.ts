import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class BlacklistInhibitor extends Inhibitor {
	//TODO Store in mongo
	private blacklist: Array<string> = [];

	constructor() {
		super('blacklist', {
			reason: 'blacklist',
		});
	}

	exec(message: Message) {
		return this.blacklist.includes(message.author.id);
	}
}