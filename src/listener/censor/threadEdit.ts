import { Listener } from 'discord-akairo';
import { ThreadChannel } from 'discord.js';
import { censorThread } from '../../util/functions';

export default class CensorThreadEditListener extends Listener {
	constructor() {
		super('censorThreadEdit', {
			emitter: 'client',
			event: 'threadUpdate',
		});
	}

	async exec(oThread: ThreadChannel, nThread: ThreadChannel) {
		if (oThread.name != nThread.name) await censorThread(nThread, oThread);
	}
}
