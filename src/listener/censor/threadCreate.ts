import { Listener } from 'discord-akairo';
import { ThreadChannel } from 'discord.js';
import { censorThread } from '../../util/functions';

export default class CensorThreadCreateListener extends Listener {
	constructor() {
		super('censorThreadCreate', {
			emitter: 'client',
			event: 'threadCreate',
		});
	}

	async exec(thread: ThreadChannel) {
		const censoredThread = await censorThread(thread);
		if (!censoredThread)
			if (thread.joinable && !thread.joined) await thread.join();
	}
}
