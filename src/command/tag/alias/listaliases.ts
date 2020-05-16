import { Message } from 'discord.js';
import { TagModel } from '../../../model/tag';
import { MessageEmbed } from 'discord.js';
import truncate from 'truncate';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { messages } from '../../../util/messages';

interface TagAlias {
	name: string;
	alias: string;
}

export default class TagListAliasesCommand extends MinehutCommand {
	constructor() {
		super('tag-listaliases', {
			aliases: ['tag-listaliases'],
			permissionLevel: PermissionLevel.Verified,
			category: 'tag',
			channel: 'guild',
			description: {
				content: messages.commands.tag.aliases.list.description,
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
