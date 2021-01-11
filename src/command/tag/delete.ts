import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class TagDeleteCommand extends MinehutCommand {
	constructor() {
		super('tag-delete', {
			permissionLevel: PermissionLevel.Helper,
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Delete a tag',
				usage: '<name/alias>',
			},
			args: [
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which tag do you want to delete?`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { name }: { name: string }) {
		name = name.replace(/\s+/g, '-').toLowerCase();
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;

		// Find tag with that name or alias
		const tag = await TagModel.findByNameOrAlias(name);
		if (!tag)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} tag \`${name}\` does not exist, check \`${prefix}tags\``
			);
		if (tag.aliases.includes(name))
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} \`${name}\` is an alias of \`${tag.name}\` -- you can delete the alias with \`${prefix}tag deletealias ${name}\`, or delete the entire tag with \`${prefix}tag delete ${tag.name}\``
			);
		await tag.remove();
		msg.channel.send(
			`:wastebasket: tag \`${tag.name}\` deleted ${
				tag.aliases.length > 0 ? `(aliases: ${tag.aliases.join(', ')})` : ''
			}`
		);
	}
}
