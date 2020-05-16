import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { MessageEmbed } from 'discord.js';

export default class TagListCommand extends Command {
	constructor() {
		super('tag-list', {
			aliases: ['tag-list', 'tags'],
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'List the tags',
			},
		});
	}

	async exec(msg: Message) {
		const tags = await TagModel.find({ guild: msg.guild!.id });
		const embed = new MessageEmbed();
		embed.setColor('ORANGE');
		embed.setTitle(`Showing ${tags.length} tags`);
		embed.setDescription(tags.map(t => `\`${t.name}\``).join(', '));
		msg.channel.send(embed);
	}
}
