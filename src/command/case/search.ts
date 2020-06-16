import { Message } from 'discord.js';
import { messages, emoji } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { User } from 'discord.js';
import { Argument } from 'discord-akairo';
import { CaseModel } from '../../model/case';
import truncate from 'truncate';
import {
	humanReadableCaseType,
	prettyDate,
	escapeMarkdown,
} from '../../util/util';
import humanize from 'humanize-duration';
import { MessageEmbed } from 'discord.js';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class CaseSearchCommand extends MinehutCommand {
	constructor() {
		super('case-search', {
			aliases: ['case-search', 'punishments', 'puns'],
			clientPermissions: ['EMBED_LINKS'],
			category: 'case',
			channel: 'guild',
			permissionLevel: PermissionLevel.JuniorModerator,
			description: {
				content: messages.commands.case.search.description,
				usage: '<target>',
			},
			args: [
				{
					id: 'target',
					type: Argument.union('user', async (msg, phrase) => {
						try {
							return await msg.client.users.fetch(phrase);
						} catch {
							return null;
						}
					}),
					prompt: {
						start: (msg: Message) =>
							messages.commands.case.search.targetPrompt.start(msg.author),
						retry: (msg: Message) =>
							messages.commands.case.search.targetPrompt.retry(msg.author),
					},
				},
				{
					id: 'showDeleted',
					match: 'flag',
					flag: ['-d', '--show-deleted'],
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ target, showDeleted }: { target: User; showDeleted: boolean }
	) {
		const m = await msg.channel.send(
			messages.commands.case.search.loading(target.tag)
		);
		let cases = await CaseModel.find({ targetId: target.id, guildId: msg.guild!.id }).sort(
			'-createdAt'
		);
		cases = cases.filter(c => showDeleted || !c.deleted);
		if (cases.length < 1)
			return m.edit(messages.commands.case.search.emptyHistory);
		const historyItems = cases.map(c =>
			[
				`${c.deleted ? '~~' : ''}\`${c._id}\` ${
					c.active ? emoji.active : emoji.inactive
				} ${humanReadableCaseType(c.type)} by **${c.moderatorTag}** (${
					c.moderatorId
				})`,
				`- **__Reason:__** ${truncate(escapeMarkdown(c.reason), 50)}`,
				c.expiresAt.getTime() !== -1
					? `- **__Duration:__** ${humanize(
							c.expiresAt.getTime() - new Date(c.createdAt).getTime(),
							{ round: true, largest: 3 }
					  )}`
					: null,
				`- **__Date:__** ${prettyDate(c.createdAt)}${c.deleted ? '~~' : ''}`,
			]
				.filter(i => i !== null)
				.join('\n')
		);
		const embed = new MessageEmbed()
			.setDescription(
				truncate(historyItems.join('\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'), 2000)
			)
			.setColor('LUMINOUS_VIVID_PINK')
			.setAuthor(
				`${target.username} (${target.id})`,
				target.displayAvatarURL()
			);
		m.edit(embed);
	}
}
