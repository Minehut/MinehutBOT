import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { TagModel } from '../../models/Tag';
import { messages } from '../../util/constants/messages';

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
		// Find tag with that name or alias
		const tag = await TagModel.findOne({
			$or: [{ name }, { aliases: { $in: [name] } }],
		});
		if (!tag)
			return msg.channel.send(
				messages.commands.tag.delete.unknownTag(
					process.env.DISCORD_PREFIX!,
					name
				)
			);
		await tag.remove();
		msg.channel.send(
			messages.commands.tag.delete.tagDeleted(tag.name, tag.aliases!)
		);
	}
}
