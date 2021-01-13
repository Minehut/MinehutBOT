import { Message } from 'discord.js';
import { TagModel } from '../../../model/tag';
import { MessageEmbed } from 'discord.js';
import { truncate } from 'lodash';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

interface TagAlias {
	name: string;
	alias: string;
}

export default class TagListAliasesCommand extends MinehutCommand {
	constructor() {
		super('tag-listaliases', {
			permissionLevel: PermissionLevel.Verified,
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'List all tag aliases',
			},
			args: [
				{
					id: 'page',
					type: 'number',
					default: 1,
				},
			],
		});
	}

	async exec(msg: Message, { page }: { page: number }) {
		const tags = await TagModel.find();
		const embed = new MessageEmbed();
		embed.setColor('ORANGE');
        page = Math.floor(page);
		const aliases: TagAlias[] = [];
		tags.forEach(t => {
			if (t.aliases.length > 0)
				t.aliases.forEach(a => aliases.push({ name: t.name, alias: a }));
        });
        const max = Math.ceil(aliases.length / 16);
        if(page < 1) page = 1;
        if(page > max) page = max;
        const output: string[] = [];
        embed.setTitle(`Showing page ${page} of all tag aliases`);
		embed.setDescription(
			truncate(
				(() => {
					for (const x of aliases.slice(page === 1 ? 0 : (page - 1) * 16, page * 16)) {
						output.push(
							`:small_orange_diamond: \`${x.alias}\` :point_right: \`${x.name}\``
						);
					}
					return output.join('\n');
				})(),
				{ length: 2045 }
			)
		);
		embed.setFooter(
			`Page ${page} out of ${max} pages; ${
				output.length
			} aliases shown.`
		);
		msg.channel.send(embed);
	}
}
