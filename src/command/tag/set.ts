import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { TagModel, Tag } from '../../model/tag';
import { PrefixSupplier } from 'discord-akairo';

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
					type: 'string',
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
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		const tag = {
			name,
			content,
			author: msg.author.id,
		} as Tag;
		const conflictingTag = await TagModel.findByAlias(tag.name);
		if (conflictingTag)
			return msg.channel.send(
				messages.commands.tag.set.conflictingAliases(
					prefix,
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
