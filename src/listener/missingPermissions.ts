import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class MissingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions',
		});
	}

	async exec(msg: Message, _command: Command, type: string, _missing: any) {
		if (type === 'user') msg.react('⛔');
		else if (type === 'client') {
			await msg.react('⛔');
			await msg.react('🤖');
		}
	}
}
