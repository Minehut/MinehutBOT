import { Listener } from 'discord-akairo';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import {
	addBreadcrumb,
	setContext,
	Severity,
	captureException,
} from '@sentry/node';

export default class SentryCommandErrorListener extends Listener {
	constructor() {
		super('sentryCommandError', {
			emitter: 'commandHandler',
			event: 'error',
			category: 'sentry',
		});
	}

	exec(error: Error, msg: Message, command: Command) {
		console.log(error);
		addBreadcrumb({
			message: 'command_errored',
			category: command ? command.category.id : 'inhibitor',
			level: Severity.Error,
			data: {
				user: {
					id: msg.author.id,
					username: msg.author.tag,
				},
				guild: msg.guild
					? {
							id: msg.guild.id,
							name: msg.guild.name,
					  }
					: null,
				command: command
					? {
							id: command.id,
							aliases: command.aliases,
							category: command.category.id,
					  }
					: null,
				message: {
					id: msg.id,
					content: msg.content,
				},
			},
		});
		setContext('command_started', {
			user: {
				id: msg.author.id,
				username: msg.author.tag,
			},
			extra: {
				guild: msg.guild
					? {
							id: msg.guild.id,
							name: msg.guild.name,
					  }
					: null,
				command: {
					id: command.id,
					aliases: command.aliases,
					category: command.category.id,
				},
				message: {
					id: msg.id,
					content: msg.content,
				},
			},
		});
		captureException(error);
	}
}
