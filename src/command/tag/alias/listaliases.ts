import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { TagModel } from '../../../model/Tag';
import { MessageEmbed } from 'discord.js';
import truncate from 'truncate';

interface TagAlias {
	name: string;
	alias: string;
}

export default class TagListAliasesCommand extends Command {
	constructor() {
		super('tag-listaliases', {
			aliases: ['tag-listaliases'],
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'List all tag aliases',
			},
		});
	}

	async exec(msg: Message) {
		const tags = await TagModel.find();
		const embed = new MessageEmbed();
		embed.setColor('ORANGE');
		embed.setTitle(`Showing all tag aliases`);
		const aliases: TagAlias[] = [];
		tags.forEach(t => {
			if (t.aliases.length > 0)
				t.aliases.forEach(a => aliases.push({ name: t.name, alias: a }));
		});
		embed.setDescription(
			truncate(
				aliases
					.map(
						a =>
							`:small_orange_diamond: \`${a.alias}\` :point_right: \`${a.name}\``
					)
					.join('\n'),
				2045
			)
		);
		msg.channel.send(embed);
	}
}