import { Message } from 'discord.js';
import { messages } from '../../../util/messages';
import { TagModel } from '../../../model/tag';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class TagSetAliasCommand extends MinehutCommand {
	constructor() {
		super('tag-setalias', {
			aliases: ['tag-setalias'],
			permissionLevel: PermissionLevel.Moderator,
			category: 'tag',
			channel: 'guild',
			description: {
				content: messages.commands.tag.aliases.set.description,
				usage: '<alias> <target>',
			},
			args: [
				{
					id: 'alias',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.aliases.set.aliasPrompt.start(msg.author),
					},
				},
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.aliases.set.namePrompt.start(msg.author),
					},
				},
			],
		});
	}

	async exec(msg: Message, { alias, name }: { alias: string; name: string }) {
		alias = alias.replace(/\s+/g, '-').toLowerCase();
		name = name.replace(/\s+/g, '-').toLowerCase();

		const existingTarget = await TagModel.findByNameOrAlias(alias, msg.guild!.id);

		// If alias already points to something, remove it from that something
		// OR if the alias already points to it and the user wanted to do that, say nothing changed
		if (existingTarget) {
			if (existingTarget.name === name || existingTarget.aliases.includes(name))
				return msg.channel.send(
					messages.commands.tag.aliases.set.nothingChanged
				);
			existingTarget.update({
				aliases: existingTarget.aliases.filter(a => a !== alias),
			});
		}

		const target = await TagModel.findByNameOrAlias(name, msg.guild!.id);
		if (!target)
			return msg.channel.send(
				messages.commands.tag.aliases.set.unknownTarget(name)
			);

		await target.updateOne({ $push: { aliases: alias } });
		target.aliases.push(alias);
		return msg.channel.send(
			messages.commands.tag.aliases.set.aliasesUpdated(
				name,
				alias,
				target.aliases
			)
		);
	}
}
