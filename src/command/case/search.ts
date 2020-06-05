import { Message } from 'discord.js';
import { messages, emoji } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { User } from 'discord.js';
import { Argument } from 'discord-akairo';
import { CaseModel } from '../../model/case';
import truncate from 'truncate';
import { humanReadableCaseType, ago } from '../../util/util';
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
			],
		});
	}

	async exec(msg: Message, { target }: { target: User }) {
		const m = await msg.channel.send(
			messages.commands.case.search.loading(target.tag)
		);
		const cases = await CaseModel.find({ targetId: target.id }).sort(
			'-createdAt'
		);
		if (cases.length < 1)
			return m.edit(messages.commands.case.search.emptyHistory);
		const historyItems = cases.map(c =>
			[
				`\`${c._id}\` ${
					c.active ? emoji.active : emoji.inactive
				} ${humanReadableCaseType(c.type)} by **${c.moderatorTag}** (${
					c.moderatorId
				})`,
				`\\↪ **__Reason:__** ${truncate(c.reason, 50)}`,
				c.expiresAt.getTime() !== -1
					? `\\↪ **__Duration:__** ${humanize(
							c.expiresAt.getTime() - new Date(c.createdAt).getTime(),
							{ round: true, largest: 3 }
					  )}`
					: null,
				`\\↪ **__Date:__** ${c.createdAt.getDate()}/${
					c.createdAt.getMonth() + 1
				}/${c.createdAt.getFullYear()} ${c.createdAt.toLocaleTimeString()} (${ago.format(
					c.createdAt
				)})`,
				c.expiresAt.getTime() !== -1
					? `\\↪ **__Expires:__** ${c.expiresAt.getDate()}/${
							c.expiresAt.getMonth() + 1
					  }/${c.expiresAt.getFullYear()} ${c.expiresAt.toLocaleTimeString()} (${ago.format(
							c.expiresAt
					  )})`
					: null,
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
