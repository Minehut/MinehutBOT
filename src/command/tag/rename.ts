import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class TagRenameCommand extends MinehutCommand {
	constructor() {
		super('tag-rename', {
			permissionLevel: PermissionLevel.Moderator,
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Rename a tag',
				usage: '<old> <new>',
			},
			args: [
				{
					id: 'oldName',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which tag do you want to rename?`,
					},
				},
				{
					id: 'newName',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what should the tag's new name be?`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ oldName, newName }: { oldName: string; newName: string }
	) {
		oldName = oldName.replace(/\s+/g, '-').toLowerCase();
		newName = newName.replace(/\s+/g, '-').toLowerCase();

		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;

		// check if name tag exists
		// check if newName is already a name or alias
		const tag = await TagModel.findByNameOrAlias(oldName);
		if (!tag)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} tag \`${oldName}\` does not exist, check \`${prefix}tags\``
			);
		oldName = tag.name;
		const tagWithNewName = await TagModel.findByNameOrAlias(newName);
		if (tagWithNewName)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} a tag with the new name/alias already exists`
			);
		await tag.updateOne({ name: newName });
		msg.channel.send(
			`${process.env.EMOJI_CHECK} tag \`${tag.name}\` is now \`${newName}\``
		);
	}
}
