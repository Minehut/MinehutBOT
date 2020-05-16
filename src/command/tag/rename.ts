import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { TagModel } from '../../model/tag';
import { PrefixSupplier } from 'discord-akairo';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class TagRenameCommand extends MinehutCommand {
	constructor() {
		super('tag-rename', {
			aliases: ['tag-rename'],
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
							messages.commands.tag.rename.oldNamePrompt.start(msg.author),
					},
				},
				{
					id: 'newName',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.rename.newNamePrompt.start(msg.author),
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
		const tag = await TagModel.findByNameOrAlias(oldName, msg.guild!.id);
		if (!tag)
			return msg.channel.send(
				messages.commands.tag.rename.unknownTag(prefix, oldName)
			);
		oldName = tag.name;
		const tagWithNewName = await TagModel.findByNameOrAlias(
			newName,
			msg.guild!.id
		);
		if (tagWithNewName)
			return msg.channel.send(messages.commands.tag.rename.conflictingName);
		await tag.updateOne({ name: newName });
		return msg.channel.send(
			messages.commands.tag.rename.tagUpdated(oldName, newName)
		);
	}
}
