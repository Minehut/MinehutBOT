import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { censorMessage } from '../../util/functions';

export default class CensorMessageSendListener extends Listener {
	constructor() {
		super('censorMessageSend', {
			emitter: 'client',
			event: 'message',
		});
	}

	async exec(msg: Message) {
		await censorMessage(msg);
	}
}
