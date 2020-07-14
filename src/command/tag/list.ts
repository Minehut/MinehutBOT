import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { MessageEmbed } from 'discord.js';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class TagListCommand extends MinehutCommand {
	constructor() {
		super('tag-list', {
			aliases: ['tags'],
			clientPermissions: ['EMBED_LINKS'],
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'List the tags',
			},
		});
	}

	async exec(msg: Message) {
		const tags = await TagModel.find().sort('name');
		const embed = new MessageEmbed();
		embed.setColor('ORANGE');
		embed.setTitle(`Showing ${tags.length} tags`);
		embed.setDescription(tags.map(t => `\`${t.name}\``).join(', '));
		msg.channel.send(embed);
	}
}
