import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/constant/messages';
import { TagModel } from '../../model/Tag';
import truncate from 'truncate';

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
		name = name.replace(/\s+/g, '-').toLowerCase();
		// Find tag with that name or alias
		const tag = await TagModel.findByNameOrAlias(name);
		if (!tag)
			return msg.channel.send(
				messages.commands.tag.show.unknownTag(process.env.DISCORD_PREFIX!, name)
			);
		msg.channel.send(truncate(messages.commands.tag.show.showTag(tag.content), 1900));
		await tag.updateOne({ uses: tag.uses + 1 });
	}
}
