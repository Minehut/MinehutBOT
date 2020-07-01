import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { TagModel } from '../../model/tag';
import truncate from 'truncate';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class TagShowCommand extends MinehutCommand {
	constructor() {
		super('tag-show', {
			category: 'tag',
			channel: 'guild',
			description: {
				content: messages.commands.tag.show.description,
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
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		// Find tag with that name or alias
		const tag = await TagModel.findByNameOrAlias(name, msg.guild!.id);
		if (!tag)
			return msg.channel.send(
				messages.commands.tag.show.unknownTag(prefix, name)
			);
		if (
			this.client.tagCooldownManager.isOnCooldown(
				`t-${tag.name}-${msg.channel.id}`
			)
		)
			return msg.react('⏲️');
		msg.channel.send(
			truncate(messages.commands.tag.show.showTag(tag.content), 1900)
		);
		this.client.tagCooldownManager.add(`t-${tag.name}-${msg.channel.id}`);
		await tag.updateOne({ uses: tag.uses + 1 });
	}
}
