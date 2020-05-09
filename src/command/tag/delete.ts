import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { TagModel } from '../../model/Tag';
import { messages } from '../../util/constant/messages';

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

		// Find tag with that name or alias
		const tag = await TagModel.findByNameOrAlias(name);
		if (!tag)
			return msg.channel.send(
				messages.commands.tag.delete.unknownTag(
					process.env.DISCORD_PREFIX!,
					name
				)
			);
		if (tag.aliases.includes(name))
			return msg.channel.send(
				messages.commands.tag.delete.useNameNotAlias(process.env.DISCORD_PREFIX!, name, tag.name)
			);
		await tag.remove();
		msg.channel.send(
			messages.commands.tag.delete.tagDeleted(tag.name, tag.aliases!)
		);
	}
}
