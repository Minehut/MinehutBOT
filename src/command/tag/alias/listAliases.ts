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
		});
	}

	async exec(msg: Message) {
		const tags = await TagModel.find({ guild: msg.guild!.id });
		const embed = new MessageEmbed();
		embed.setColor('ORANGE');
		embed.setTitle(`Showing all tag aliases`);
		const aliases: TagAlias[] = [];
		tags.forEach(t => {
			if (t.aliases.length > 0)
				t.aliases.forEach(a => aliases.push({ name: t.name, alias: a }));
		});
		// TODO: use pagination here
		embed.setDescription(
			truncate(
				aliases
					.map(
						a =>
							`:small_orange_diamond: \`${a.alias}\` :point_right: \`${a.name}\``
					)
					.join('\n'),
				{ length: 2045 }
			)
		);
		msg.channel.send(embed);
	}
}
