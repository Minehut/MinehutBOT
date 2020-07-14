import { Listener } from 'discord-akairo';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { addBreadcrumb, setContext, Severity } from '@sentry/node';

export default class SentryCommandStartedListener extends Listener {
	constructor() {
		super('sentryCommandStarted', {
			emitter: 'commandHandler',
			event: 'commandStarted',
			category: 'sentry',
		});
	}

	exec(msg: Message, command: Command, args: any) {
		addBreadcrumb({
			message: 'command_started',
			category: command.category.id,
			level: Severity.Info,
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
				command: {
					id: command.id,
					aliases: command.aliases,
					category: command.category.id,
				},
				message: {
					id: msg.id,
					content: msg.content,
				},
				args,
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
				args,
			},
		});
	}
}
