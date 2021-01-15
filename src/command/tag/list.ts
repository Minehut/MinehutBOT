import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { MessageEmbed } from 'discord.js';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { truncate, chunk } from 'lodash';
import { editMessageWithPaginatedEmbeds } from 'discord.js-pagination-ts';

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
			args: [
				{
					id: 'category',
					type: 'string',
					default: null,
				},
			],
		});
	}

	async exec(msg: Message, { category }: { category: string }) {
		const tags = await TagModel.find().sort('name');
		const fields: { [key: string]: typeof tags[0][] } = {};
		for (const tag of tags) {
			if (!fields[tag.category || 'Uncategorized'])
				fields[tag.category || 'Uncategorized'] = [];
			fields[tag.category || 'Uncategorized'].push(tag);
		}
		if (!category) {
			const embed = new MessageEmbed();
			embed.setColor('ORANGE');
			embed.setTitle(`Showing ${tags.length} tags`);
			for (const name in fields) {
				const field: object[] = fields[name];
				const mapped: string = truncate(
					field.map((t: { name?: string }) => `\`${t.name}\``).join(', '),
					{ length: 512 }
				);
				embed.addField(name, mapped, true);
			}
			msg.channel.send(embed);
		} else {
			let exists = false;
			for (const field in fields)
				if (field.toLowerCase() === category.toLowerCase()) {
					exists = true;
					category = field;
				}
			if (!exists)
				return msg.channel.send(
					`${process.env.EMOJI_CROSS} Category \`${category}\` does not exist.`
				);
			const m = await msg.channel.send(
				`${process.env.EMOJI_LOADING} Fetching tags in category \`${category}\`.`
			);
			const items: string[] = fields[category].map(
				(t: { name?: string }) => `\`${t.name}\``
			);
			const chunks = chunk(items, 30);
			const embeds = [];
			for (let i = 0; i < chunks.length; i++) {
				const page = i + 1;
				embeds.push(
					new MessageEmbed()
						.setDescription(
							truncate(chunks[i].join(', '), {
								length: 2000,
							})
						)
						.setColor('ORANGE')
						.setAuthor(`Listing tags in category ${category}`)
						.setFooter(`**__Showing page ${page} of ${chunks.length}**__`)
				);
			}
			editMessageWithPaginatedEmbeds(m, embeds, {
				owner: msg.author,
				footer: `Showing page {current} of {max} • ${items.length} tag${
					items.length > 1 ? 's' : ''
				}`,
			});
		}
	}
}
