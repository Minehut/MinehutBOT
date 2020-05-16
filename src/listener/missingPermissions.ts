import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import { messages } from '../util/messages';

export default class MissingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions',
		});
	}

	exec(msg: Message, _command: Command, type: string, missing: any) {
		if (type === 'user')
			return msg.channel.send(
				messages.events.commandHandler.missingPermissions.user(missing)
			);
		else if (type === 'client')
			return msg.channel.send(
				messages.events.commandHandler.missingPermissions.client(missing)
			);
	}
}
