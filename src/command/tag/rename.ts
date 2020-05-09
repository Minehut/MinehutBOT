import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/constant/messages';
import { TagModel } from '../../model/Tag';

export default class TagRenameCommand extends Command {
	constructor() {
		super('tag-rename', {
			aliases: ['tag-rename'],
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

		// check if name tag exists
		// check if newName is already a name or alias
		const tag = await TagModel.findByNameOrAlias(oldName);
		if (!tag)
			return msg.channel.send(
				messages.commands.tag.rename.unknownTag(
					process.env.DISCORD_PREFIX!,
					oldName
				)
			);
		oldName = tag.name;
		const tagWithNewName = await TagModel.findByNameOrAlias(newName);
		if (tagWithNewName)
			return msg.channel.send(messages.commands.tag.rename.conflictingName);
		await tag.updateOne({ name: newName });
		return msg.channel.send(
			messages.commands.tag.rename.tagUpdated(oldName, newName)
		);
	}
}
