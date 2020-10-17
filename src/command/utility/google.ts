import { Message } from 'discord.js';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { MessageEmbed } from 'discord.js';

export default class GoogleCommand extends MinehutCommand {
	constructor() {
		super('google', {
			aliases: ['google', 'g'],
			category: 'utility',
			description: {
				content: 'Provides google search link for input',
				usage: '[query]',
			},
			args: [
				{
					id: 'query',
					match: 'text',
				},
			],
		});
	}


	async exec(msg: Message, { query }: { query: string; }) {
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;

		if (!query) {
			const embed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle('Google it')
				.setDescription(
					`Try searching your question at https://google.com/, or use \`${prefix}google [query]\`.`
				);
			return msg.channel.send(embed);
		}
		msg.channel.send(
			`https://google.com/search?q=${encodeURIComponent(query)}`
		);
	}
}
