import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { MinehutClientOptions } from './minehutClientOptions';
import { Mongoose } from 'mongoose';
import { Message } from 'discord.js';
import { InhibitorHandler } from 'discord-akairo';

export class MinehutClient extends AkairoClient {
	commandHandler: CommandHandler;
	listenerHandler: ListenerHandler;
	inhibitorHandler: InhibitorHandler;

	ownerIds: string[] | undefined;
	mongo?: Mongoose;

	constructor(options: MinehutClientOptions) {
		// TODO: validate options

		super(
			{
				ownerID: options.ownerIds,
			},
			{
				disableMentions: 'everyone',
			}
		);

		this.ownerIds = options.ownerIds;
		this.mongo = options.mongo;

		this.commandHandler = new CommandHandler(this, {
			directory: './src/command/',
			prefix: options.prefix,
			commandUtil: true,
			allowMention: true,
		});
		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/listener/',
		});
		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './src/inhibitor/'
	});
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();

		this.commandHandler.resolver.addType('handler', (_msg: Message, phrase) => {
			if (!phrase) return null;
			switch (phrase.toLowerCase()) {
				case 'cmd':
				case 'command':
					return this.commandHandler;
				
				case 'listener':
				case 'event':
					return this.listenerHandler;
				
				case 'inhibitor':
					return this.inhibitorHandler;

				default:
					return null;
			}
		});
	}
}

declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
		ownerIds: string[] | undefined;
	}
}
