import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { capitalize } from 'lodash';

export default class TagSetSectionCommand extends MinehutCommand {
	constructor() {
		super('tag-setsection', {
			permissionLevel: PermissionLevel.Helper,
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Set/edit the section of a tag',
				usage: '<name> <section>',
			},
			args: [
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what is the name of the tag?`,
					},
				},
				{
					id: 'section',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what should the tag's section be?`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ name, section }: { name: string; section: string }
	) {
		section = capitalize(section);
		name = name.replace(/\s+/g, '-').toLowerCase();
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;

		// check if tag exists
		const tag = await TagModel.findByNameOrAlias(name);
		if (!tag) {
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} tag \`${name}\` does not exist, check \`${prefix}tags\``
			);
		}
		await tag.updateOne({ section });
		msg.channel.send(
			`${process.env.EMOJI_CHECK} tag \`${name}\`'s section is now \`${section}\``
		);
	}
}
