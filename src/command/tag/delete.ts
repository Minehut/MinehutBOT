import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { messages } from '../../util/messages';
import { PrefixSupplier } from 'discord-akairo';

export default class TagDeleteCommand extends Command {
	constructor() {
		super('tag-delete', {
			aliases: ['tag-delete'],
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
