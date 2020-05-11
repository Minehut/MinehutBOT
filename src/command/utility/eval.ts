import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { inspect } from 'util';
import { PrefixSupplier } from 'discord-akairo';

export default class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			category: 'utility',
			ownerOnly: true,
			description: {
				content: 'Evaluate JavaScript code',
				usage: '<expression>',
			},
			args: [
				{
					id: 'expression',
					match: 'text',
				},
			],
		});
	}

	async exec(
		msg: Message,
		{
			expression,
		}: {
			expression: string;
		}
	) {
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;

		if (!expression)
			return msg.channel.send(
				messages.commands.common.useHelp(prefix, this.aliases[0])
			);
		let content: string;
		try {
			let evaled = eval(expression);
			if (typeof evaled !== 'string') evaled = inspect(evaled);
			content = `\`\`\`xl\n${this.clean(evaled)}\`\`\``;
		} catch (err) {
			content = `\`ERROR\` \`\`\`xl\n${this.clean(err.toString())}\n\`\`\``;
		}
		if (content.length > 2000) {
			console.log(content);
			return msg.channel.send(
				messages.commands.eval.outputTooLong(content.length)
			);
		}
		msg.channel.send(content);
	}

	private clean(text: string) {
		text = text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203))
			.replace(new RegExp(this.client.token!, 'g'), '[token redacted]');
		return text;
	}
}
