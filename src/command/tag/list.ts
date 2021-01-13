import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { MessageEmbed } from 'discord.js';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { truncate } from 'lodash';

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
		const fields: { [ key: string ] : typeof tags[0][] } = {};
		for (const tag of tags) {
			if (!fields[tag.section || 'Uncategorized'])
				fields[tag.section || 'Uncategorized'] = [];
			fields[tag.section || 'Uncategorized'].push(tag);
		}
		for (const name in fields) {
			const field: object[] = fields[name];
			const mapped: string = truncate(
				field.map((t: { name? : string }) => `\`${t.name}\``).join(', '),
				{ length: 512 }
			);
			embed.addField(name, mapped, true);
		}
		msg.channel.send(embed);
	}
}
