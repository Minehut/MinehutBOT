import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { TagModel } from '../../model/tag';
import { MessageEmbed } from 'discord.js';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';

export default class TagInfoCommand extends MinehutCommand {
	constructor() {
		super('tag-info', {
			aliases: ['tag-info'],
			clientPermissions: ['EMBED_LINKS'],
			category: 'tag',
			channel: 'guild',
			description: {
				content: messages.commands.tag.info.description,
				usage: '<name/alias>',
			},
			args: [
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.info.namePrompt.start(msg.author),
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
				messages.commands.tag.info.unknownTag(prefix, name)
			);
		// send embed of tag info here
		const embed = new MessageEmbed();
		embed.setColor('YELLOW');
		embed.addField('Name', tag.name);
		const author = await this.client.users.fetch(tag.author);
		embed.addField(
			'Author',
			author ? `${author.tag} (${author.id})` : `<@${tag.author}>`
		);
		// embed.addField('Guild', 'coming soon tm');
		if (tag.aliases.length > 0)
			embed.addField('Aliases', tag.aliases.map(a => `\`${a}\``).join(', '));
		// embed.addField('Uses', 'coming soon tm');
		embed.addField(
			'Created at',
			`${tag.createdAt.getDate()}/${
				tag.createdAt.getMonth() + 1
			}/${tag.createdAt.getFullYear()} ${tag.createdAt.toLocaleTimeString()}`,
			true
		);
		embed.addField(
			'Updated at',
			`${tag.updatedAt.getDate()}/${
				tag.updatedAt.getMonth() + 1
			}/${tag.updatedAt.getFullYear()} ${tag.updatedAt.toLocaleTimeString()}`,
			true
		);
		msg.channel.send(embed);
	}
}
