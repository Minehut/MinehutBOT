import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping'],
		});
	}

	async exec(msg: Message) {
		const m = await msg.channel.send(':ping_pong: Ping?');
		m.edit(
			`:ping_pong: Pong! (Roundtrip: ${
				m.createdTimestamp - msg.createdTimestamp
			}ms | One-way: ${~~this.client.ws.ping}ms)`
		);
	}
}
