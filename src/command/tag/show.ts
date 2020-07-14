import { Message } from 'discord.js';
import { emoji } from '../../util/messages';
import { TagModel } from '../../model/tag';
import { truncate } from 'lodash';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class TagShowCommand extends MinehutCommand {
	constructor() {
		super('tag-show', {
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
							`${msg.author}, which tag do you want to show?`,
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
				`${emoji.cross} tag \`${name}\` does not exist, check \`${prefix}tags\``
			);
		if (
			this.client.tagCooldownManager.isOnCooldown(
				`t-${tag.name}-${msg.channel.id}`
			)
		)
			return msg.react('⏲️');
		msg.channel.send(truncate(tag.content, { length: 1900 }));
		this.client.tagCooldownManager.add(`t-${tag.name}-${msg.channel.id}`);
		await tag.updateOne({ uses: tag.uses + 1 });
	}
}
