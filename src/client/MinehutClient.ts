import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import MinehutClientOptions from './MinehutClientOptions';

export default class MinehutClient extends AkairoClient {
	commandHandler: CommandHandler;
	listenerHandler: ListenerHandler;

	ownerIds: string[] | undefined;

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

		this.commandHandler = new CommandHandler(this, {
			directory: './src/commands/',
			prefix: options.prefix,
		});
		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/listeners/',
		});
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
	}
}

declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		ownerIds: string[] | undefined;
	}
}