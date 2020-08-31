import { MinehutCommand } from '../../structure/command/minehutCommand';
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { PrefixSupplier } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

export default class HelpCommand extends MinehutCommand {
	constructor() {
		super('help', {
			aliases: ['help'],
			description: {
				content:
					'Lists available commands or displays detailed information for a specific command',
				usage: '[command]',
				examples: ['case', 'tag', 'ban', ''],
			},
			category: 'utility',
			args: [
				{
					id: 'command',
					type: 'commandAlias',
				},
			],
		});
	}

	async exec(msg: Message, { command }: { command: Command }) {
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		if (!command) {
			const embed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle('Commands')
				.setDescription(
					`This is a list of available Minehut bot commands\nFor more information about a command, use **\`${prefix}help <command>\`**`
				);

			for (const category of this.handler.categories.values()) {
				embed.addField(
					`${category.id.replace(/(\b\w)/gi, lc => lc.toUpperCase())}`,
					category
						.filter(cmd => cmd.aliases.length > 0)
						.map(cmd => `\`${cmd.aliases[0]}\``)
						.join(' ')
				);
			}

			return msg.channel.send(embed);
		}

		const embed = new MessageEmbed()
			.setColor(3447003)
			.setTitle(
				`\`${command.aliases[0]}${
					command.description.usage ? ` ${command.description.usage}` : ''
				}\``
			)
			.addField('Description', command.description.content ?? '\u200b');

		if (command.aliases.length > 1)
			embed.addField('Aliases', `\`${command.aliases.join('` `')}\``, true);

		if (command.description.examples?.length)
			embed.addField(
				'Examples',
				`\`${command.aliases[0]} ${command.description.examples.join(
					`\`\n\`${command.aliases[0]} `
				)}\``
			);

		return msg.channel.send(embed);
	}
}
