import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { MinehutClientOptions } from './minehutClientOptions';
import { Mongoose } from 'mongoose';
import { Message } from 'discord.js';
import { InhibitorHandler } from 'discord-akairo';
import { guildConfigs } from '../guild/config/guildConfigs';
import { messages } from '../util/messages';
import { CaseModel } from '../model/case';
import parseDuration from 'parse-duration';
import { BanScheduler } from '../structure/scheduler/banScheduler';
import { MuteScheduler } from '../structure/scheduler/muteScheduler';
import { CooldownManager } from '../structure/cooldownManager';
import MinehutClientEvents from './minehutClientEvents';

import { Minehut } from 'minehut';

export class MinehutClient extends AkairoClient {
	commandHandler: CommandHandler;
	listenerHandler: ListenerHandler;
	inhibitorHandler: InhibitorHandler;

	banScheduler: BanScheduler;
	muteScheduler: MuteScheduler;

	tagCooldownManager: CooldownManager;

	minehutApi: Minehut;

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
			prefix: (msg: Message) => {
				if (!msg.guild) return options.prefix!;
				const config = guildConfigs.get(msg.guild.id);
				return config ? config.prefix || options.prefix! : options.prefix!;
			},
			argumentDefaults: {
				prompt: {
					modifyRetry: (_, str) =>
						messages.commandHandler.prompt.modifyRetry(str),
					modifyStart: (_, str) =>
						messages.commandHandler.prompt.modifyStart(str),
					timeout: messages.commandHandler.prompt.timeout,
					ended: messages.commandHandler.prompt.ended,
					cancel: messages.commandHandler.prompt.cancel,
					retries: 3,
					time: 30000,
				},
			},
			commandUtil: true,
			allowMention: true,
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/listener/',
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './src/inhibitor/',
		});

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		// this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
		// this.inhibitorHandler.loadAll();

		this.banScheduler = new BanScheduler(this);
		this.muteScheduler = new MuteScheduler(this);

		this.tagCooldownManager = new CooldownManager(10000);

		this.minehutApi = new Minehut();

		this.registerArgTypes();
	}

	start(token: string) {
		super.login(token);
	}

	registerArgTypes() {
		this.commandHandler.resolver.addType('handler', (_msg: Message, phrase) => {
			if (!phrase) return null;
			switch (phrase.toLowerCase()) {
				case 'cmd':
				case 'command':
					return this.commandHandler;

				case 'listener':
				case 'event':
					return this.listenerHandler;

				case 'block':
				case 'check':
				case 'inhibitor':
					return this.inhibitorHandler;

				default:
					return null;
			}
		});

		this.commandHandler.resolver.addType(
			'caseId',
			async (_msg: Message, phrase) => {
				if (!phrase) return null;

				const c = await CaseModel.findOne({ _id: phrase });
				if (!c) return null;
				return c;
			}
		);

		this.commandHandler.resolver.addType(
			'duration',
			(_msg: Message, phrase) => {
				const parsed = parseDuration(phrase);
				return parsed;
			}
		);
	}
}

declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
		ownerIds: string[] | undefined;
		banScheduler: BanScheduler;
		muteScheduler: MuteScheduler;
		tagCooldownManager: CooldownManager;
		minehutApi: Minehut;

		start(token: string): void;
		registerArgTypes(): void;

		on<K extends keyof MinehutClientEvents>(
			event: K,
			listener: (...args: MinehutClientEvents[K]) => void
		): this;

		once<K extends keyof MinehutClientEvents>(
			event: K,
			listener: (...args: MinehutClientEvents[K]) => void
		): this;

		emit<K extends keyof MinehutClientEvents>(
			event: K,
			...args: MinehutClientEvents[K]
		): boolean;
	}
}
