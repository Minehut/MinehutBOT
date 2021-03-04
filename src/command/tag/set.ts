import { Message } from 'discord.js';
import { TagModel, Tag } from '../../model/tag';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { capitalize } from 'lodash';

export default class TagSetCommand extends MinehutCommand {
	constructor() {
		super('tag-set', {
			permissionLevel: PermissionLevel.Helper,
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Set/edit a tag',
				usage: '<section> <name> <content>',
			},
			args: [
				{
					id: 'section',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what section does the tag belong in?`,
					},
				},
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what should the tag be called? (spaces allowed)`,
					},
				},
				{
					id: 'content',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what should the tag's content be?`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ section, name, content }: { section: string; name: string; content: string }
	) {
		section = capitalize(section);
		name = name.replace(/\s+/g, '-').toLowerCase();
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		const tag = {
			section,
			name,
			content,
			author: msg.author.id,
			guild: msg.guild!.id,
		} as Tag;
		const conflictingTag = await TagModel.findByAlias(tag.name);
		if (conflictingTag)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} tag name conflicts with \`${conflictingTag.name}\`'s aliases (use ${prefix}tag info ${conflictingTag.name})`
			);
		if (!(await TagModel.exists({ name }))) {
			TagModel.create(tag);
			return msg.channel.send(
				`${process.env.EMOJI_CHECK} tag \`${tag.name}\` created`
			);
		} else await TagModel.updateOne({ name }, tag);
		return msg.channel.send(
			`${process.env.EMOJI_CHECK} tag \`${tag.name}\` updated`
		);
	}
}
