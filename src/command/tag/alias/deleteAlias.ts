import { Message } from 'discord.js';
import { TagModel } from '../../../model/tag';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class TagSetAliasCommand extends MinehutCommand {
	constructor() {
		super('tag-deletealias', {
			permissionLevel: PermissionLevel.Support,
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Delete a tag alias',
				usage: '<alias>',
			},
			args: [
				{
					id: 'alias',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which tag alias do you want to delete?`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { alias }: { alias: string }) {
		alias = alias.replace(/\s+/g, '-').toLowerCase();

		const tag = await TagModel.findByNameOrAlias(alias);

		if (tag) {
			if (tag.name === alias)
				return msg.channel.send(
					`${process.env.EMOJI_CROSS} \`${alias}\` is a name, not an alias`
				);
			else if (tag.aliases.includes(alias)) {
				msg.channel.send(tag.aliases);
				await tag.updateOne({
					aliases: tag.aliases.filter(a => a !== alias),
				});
				return msg.channel.send(
					`${process.env.EMOJI_CHECK} deleted alias \`${alias}\``
				);
			}
		} else {
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} unknown alias \`${alias}\``
			);
		}
	}
}
