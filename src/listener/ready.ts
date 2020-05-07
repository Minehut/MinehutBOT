import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	exec() {
		console.log(`Logged in as ${this.client.user?.tag}`);
	}
}
