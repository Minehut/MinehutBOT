import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { messages } from '../../util/messages';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class TagDeleteCommand extends MinehutCommand {
	constructor() {
		super('tag-delete', {
			permissionLevel: PermissionLevel.Moderator,
			category: 'tag',
			channel: 'guild',
			description: {
				content: messages.commands.tag.delete.description,
				usage: '<name/alias>',
			},
			args: [
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.delete.namePrompt.start(msg.author),
					},
				},
			],
		});
	}

	async exec(msg: Message, { name }: { name: string }) {
		name = name.replace(/\s+/g, '-').toLowerCase();
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;

		// Find tag with that name or alias
		const tag = await TagModel.findByNameOrAlias(name, msg.guild!.id);
		if (!tag)
			return msg.channel.send(
				messages.commands.tag.delete.unknownTag(prefix, name)
			);
		if (tag.aliases.includes(name))
			return msg.channel.send(
				messages.commands.tag.delete.useNameNotAlias(
					prefix,
					name,
					tag.name
				)
			);
		await tag.remove();
		msg.channel.send(
			messages.commands.tag.delete.tagDeleted(tag.name, tag.aliases!)
		);
	}
}
