import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { censorMessage } from '../../util/functions';

export default class CensorMessageEditListener extends Listener {
	constructor() {
		super('censorMessageEdit', {
			emitter: 'client',
			event: 'messageUpdate',
		});
	}

	async exec(oldMsg: Message, newMsg: Message) {
		if (oldMsg.content !== newMsg.content) await censorMessage(newMsg);
	}
}
