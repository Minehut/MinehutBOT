import { Listener } from 'discord-akairo';
import { ThreadChannel } from 'discord.js';

export default class ThreadCreateListener extends Listener {
	constructor() {
		super('threadCreateListener', {
			emitter: 'client',
			event: 'threadCreate',
		});
	}

	async exec(thread: ThreadChannel) {
		if (thread.joinable && !thread.joined) await thread.join();
	}
}
