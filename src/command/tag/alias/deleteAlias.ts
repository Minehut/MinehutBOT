import { Message } from 'discord.js';
import { messages } from '../../../util/messages';
import { TagModel } from '../../../model/tag';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class TagSetAliasCommand extends MinehutCommand {
	constructor() {
		super('tag-deletealias', {
			permissionLevel: PermissionLevel.Moderator,
			category: 'tag',
			channel: 'guild',
			description: {
				content: messages.commands.tag.aliases.delete.description,
				usage: '<alias>',
			},
			args: [
				{
					id: 'alias',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.aliases.set.aliasPrompt.start(msg.author),
					},
				},
			],
		});
	}

	async exec(msg: Message, { alias }: { alias: string }) {
		alias = alias.replace(/\s+/g, '-').toLowerCase();

		const tag = await TagModel.findByNameOrAlias(alias, msg.guild!.id);

		if (tag) {
			if (tag.name === alias)
				return msg.channel.send(
					messages.commands.tag.aliases.delete.aliasIsName(alias)
				);
			else if (tag.aliases.includes(alias)) {
				msg.channel.send(tag.aliases);
				await tag.updateOne({
					aliases: tag.aliases.filter(a => a !== alias),
				});
				return msg.channel.send(
					messages.commands.tag.aliases.delete.deletedAlias(alias)
				);
			}
		} else {
			return msg.channel.send(
				messages.commands.tag.aliases.delete.unknownAlias(alias)
			);
		}
	}
}
