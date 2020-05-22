import { Message } from 'discord.js';
import { messages } from '../../util/messages';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { User } from 'discord.js';
import { Argument } from 'discord-akairo';
import { CaseModel } from '../../model/case';
import Table from 'cli-table3';
import truncate from 'truncate';

const tableOptions: Table.TableConstructorOptions = {
	head: ['#', 'Active', 'Date', 'Target', 'Moderator', 'Type', 'Reason'],
	chars: {
		top: '═',
		'top-mid': '╤',
		'top-left': '╔',
		'top-right': '╗',
		bottom: '═',
		'bottom-mid': '╧',
		'bottom-left': '╚',
		'bottom-right': '╝',
		left: '║',
		'left-mid': '╟',
		mid: '─',
		'mid-mid': '┼',
		right: '║',
		'right-mid': '╢',
		middle: '│',
	},
	style: {
		head: [], //disable colors in header cells
		border: [], //disable colors for the border
	},
};

export default class CaseSearchCommand extends MinehutCommand {
	constructor() {
		super('case-search', {
			aliases: ['case-search'],
			clientPermissions: ['EMBED_LINKS'],
			category: 'case',
			channel: 'guild',
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
		const table = new Table(tableOptions);
		cases.forEach(c => {
			table.push([
				c.id,
				c.active ? 'Yes' : 'No',
				`${c.createdAt.getDate()}/${
					c.createdAt.getMonth() + 1
				}/${c.createdAt.getFullYear()} ${c.createdAt.toLocaleTimeString()}`,
				`${c.targetTag} (${c.targetId})`,
				`${c.moderatorTag} (${c.moderatorId})`,
				c.type,
				truncate(c.reason, 24),
			]);
		});
		m.edit(table.toString(), { code: true });
	}
}
