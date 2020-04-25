import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import {
	InhibitorHandler,
	CommandHandler,
	ListenerHandler,
} from 'discord-akairo';

export default class ReloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload'],
			category: 'utility',
			channel: 'guild',
			description: {
				content: 'Reload a module',
				usage: '<handler> <moduleid>',
			},
			args: [
				{
					id: 'handler',
					type: 'handler',
				},
				{
					id: 'module',
					type: 'string',
				},
			],
		});
	}

	async exec(
		msg: Message,
		{
			handler,
			module,
		}: {
			handler: CommandHandler | InhibitorHandler | ListenerHandler;
			module: string;
		}
	) {
		try {
			const mod = handler.reload(module.toLowerCase());
			msg.channel.send(`reloaded \`${mod.id}\` ${mod.category ? `(${mod.category})` : ''}`);
		} catch (err) {
			const e = err as Error;
			msg.channel.send(e.message);
		}
	}
}
