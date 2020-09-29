import { Message } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { User } from 'discord.js';
import { Argument } from 'discord-akairo';
import { CaseModel } from '../../../model/case';
import { truncate } from 'lodash';
import { humanReadableCaseType, prettyDate } from '../../../util/functions';
import humanize from 'humanize-duration';
import { MessageEmbed } from 'discord.js';
import { PermissionLevel } from '../../../util/permission/permissionLevel';
import { Util } from 'discord.js';
import { chunk } from 'lodash';
import { editMessageWithPaginatedEmbeds } from 'discord.js-pagination-ts';

export default class CaseSearchCommand extends MinehutCommand {
	constructor() {
		super('case-search', {
			aliases: ['punishments', 'puns'],
			clientPermissions: ['EMBED_LINKS'],
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.JuniorModerator,
			description: {
				content: `Lookup cases where specific user is the target`,
				usage: '<user>',
				examples: ['search @daniel', 'search 250536623270264833'],
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
							`${msg.author}, who do you want to lookup?`,
						retry: (msg: Message) => `${msg.author}, please mention a user.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { target }: { target: User }) {
		const m = await msg.channel.send(
			`${process.env.EMOJI_LOADING} Searching for cases where target is **${target.tag}**`
		);
		let cases = await CaseModel.find({
			targetId: target.id,
			guild: msg.guild!.id,
		}).sort('-createdAt');
		if (cases.length < 1)
			return m.edit(`${process.env.EMOJI_DAB} No cases found for this user`);
		const historyItems = cases.map(c =>
			[
				`\`${c._id}\` ${
					c.active
						? process.env.EMOJI_STATUS_ONLINE
						: process.env.EMOJI_STATUS_DND
				} ${humanReadableCaseType(c.type)} by **${c.moderatorTag}** (${
					c.moderatorId
				})`,
				`- **__Reason:__** ${truncate(Util.escapeMarkdown(c.reason), {
					length: 200,
				})}`,
				c.expiresAt.getTime() > -1
					? `- **__Duration:__** ${humanize(
							c.expiresAt.getTime() - c.createdAt.getTime(),
							{ round: true, largest: 3 }
					  )}`
					: null,
				`- **__Date:__** ${prettyDate(c.createdAt)}`,
				c.expiresAt.getTime() > -1
					? `- **__Expires:__** ${prettyDate(c.expiresAt)}`
					: null,
			]
				.filter(i => i !== null)
				.join('\n')
		);
		const itemChunks = chunk(historyItems, 7);
		const embeds = [];
		for (let i = 0; i < itemChunks.length; i++) {
			const pageNum = i + 1;
			embeds.push(
				new MessageEmbed()
					.setDescription(
						truncate(itemChunks[i].join('\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'), {
							length: 2000,
						})
					)
					.setColor('LUMINOUS_VIVID_PINK')
					.setAuthor(`${target.tag} (${target.id})`, target.displayAvatarURL())
					.setFooter(`**__Showing page ${pageNum} of ${itemChunks.length}**__`)
			);
		}
		editMessageWithPaginatedEmbeds(m, embeds, {
			owner: msg.author,
			footer: `Showing page {current} of {max} • ${historyItems.length} case${
				historyItems.length > 1 ? 's' : ''
			}`,
		});
	}
}
