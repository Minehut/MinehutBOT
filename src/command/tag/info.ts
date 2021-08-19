import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { MessageEmbed } from 'discord.js';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { prettyDate } from '../../util/functions';

export default class TagInfoCommand extends MinehutCommand {
	constructor() {
		super('tag-info', {
			clientPermissions: ['EMBED_LINKS'],
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Lookup a tag',
				usage: '<name/alias>',
			},
			args: [
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which tag do you want to lookup?`,
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
		// send embed of tag info here
		const embed = new MessageEmbed();
		embed.setColor('YELLOW');
		embed.addField('Name', tag.name);
		if (tag.aliases.length > 0)
			embed.addField(
				'Aliases',
				tag.aliases.map((a: string) => `\`${a}\``).join(', '),
				true
			);
		embed.addField('Section', tag.section, true);
		embed.addField('Uses', tag.uses.toString(), true);
		const author = await this.client.users.fetch(tag.author);
		embed.addField(
			'Author',
			author ? `${author.tag} (${author.id})` : `<@${tag.author}>`
		);
		embed.addField('Created at', prettyDate(tag.createdAt), true);
		embed.addField('Updated at', prettyDate(tag.updatedAt), true);
		msg.channel.send({ embeds: [embed] });
	}
}
