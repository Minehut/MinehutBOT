import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/constants/messages';
import { TagModel, Tag } from '../../models/Tag';

export default class TagSetCommand extends Command {
	constructor() {
		super('tag-set', {
			aliases: ['tag-set'],
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Set/edit a tag',
				usage: '<name> <content>',
			},
			args: [
				{
					id: 'name',
					type: 'tagName',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.set.namePrompt.start(msg.author),
					},
				},
				{
					id: 'content',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.set.contentPrompt.start(msg.author),
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ name, content }: { name: string; content: string }
	) {
		name = name.replace(/\s+/g, '-').toLowerCase();
		const tag = {
			name,
			content,
		} as Tag;
		const conflictingTag = await TagModel.findOne({
			aliases: { $all: [tag.name] },
		});
		if (conflictingTag)
			return msg.channel.send(
				messages.commands.tag.set.conflictingAliases(
					process.env.DISCORD_PREFIX!,
					conflictingTag.name
				)
			);
		if (!(await TagModel.exists({ name }))) {
			TagModel.create(tag);
			return msg.channel.send(messages.commands.tag.set.tagCreated(tag.name));
		} else await TagModel.updateOne({ name }, tag);
		return msg.channel.send(messages.commands.tag.set.tagUpdated(tag.name));
	}
}
