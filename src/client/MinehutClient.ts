import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import MinehutClientOptions from './MinehutClientOptions';

export default class MinehutClient extends AkairoClient {
	commandHandler: CommandHandler;
	listenerHandler: ListenerHandler;

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
