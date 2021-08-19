import { Message } from 'discord.js';
import { TagModel } from '../../../model/tag';
import { MessageEmbed } from 'discord.js';
import { truncate, chunk } from 'lodash';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { editMessageWithPaginatedEmbeds } from 'discord.js-pagination-ts';

interface TagAlias {
	name: string;
	alias: string;
}

export default class TagListAliasesCommand extends MinehutCommand {
	constructor() {
		super('tag-listaliases', {
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'List all tag aliases',
			},
		});
	}

	async exec(msg: Message) {
		const m = await msg.channel.send(
			`${process.env.EMOJI_LOADING} Retrieving tag aliases.`
		);
		const tags = await TagModel.find();
		const aliases: TagAlias[] = [];
		tags.forEach(t => {
			if (t.aliases.length > 0)
				t.aliases.forEach(a => aliases.push({ name: t.name, alias: a }));
		});
		if (aliases.length < 1) {
			return m.edit(`${process.env.EMOJI_DAB} No tag aliases found`);
		}
		const items = aliases.map(
			a => `:small_orange_diamond: \`${a.alias}\` :point_right: \`${a.name}\``
		);
		const chunks = chunk(items, 16);
		const embeds = [];
		for (let i = 0; i < chunks.length; i++) {
			const page = i + 1;
			embeds.push(
				new MessageEmbed()
					.setDescription(
						truncate(chunks[i].join('\n'), {
							length: 2000,
						})
					)
					.setColor('ORANGE')
					.setAuthor(`Listing tag aliases`)
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
