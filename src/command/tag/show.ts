import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { truncate } from 'lodash';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { MessageEmbed } from 'discord.js';
import { IMGUR_LINK_REGEX } from '../../util/constants';

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
				`${process.env.EMOJI_CROSS} tag \`${name}\` does not exist, check \`${prefix}tags\``
			);
		if (
			this.client.tagCooldownManager.isOnCooldown(
				`t-${tag.name}-${msg.channel.id}`
			)
		)
			return msg.react('⏲️');

		const matches = tag.content.match(IMGUR_LINK_REGEX);
		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setFooter(
				`Requested by ${msg.author.tag}`,
				msg.author.displayAvatarURL()
			);
		let content = tag.content;
		if (matches) {
			const link = matches[0];
			content = tag.content.replace(link, '');
			embed.setImage(link);
		}
		embed.setDescription(truncate(content, { length: 2048 }));

		msg.channel.send({ embeds: [embed] });

		this.client.tagCooldownManager.add(`t-${tag.name}-${msg.channel.id}`);
		await tag.updateOne({ uses: tag.uses + 1 });
	}
}
