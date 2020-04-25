import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/constants/messages';
import { TagModel } from '../../models/Tag';

export default class TagShowCommand extends Command {
	constructor() {
		super('tag-show', {
			aliases: ['tag-show'],
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Show specific tag',
				usage: '<name/alias>',
			},
			args: [
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.show.namePrompt.start(msg.author),
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
		if (tag) return msg.channel.send(tag.content);
		else msg.channel.send(messages.commands.tag.show.unknownTag(process.env.DISCORD_PREFIX!));
	}
}