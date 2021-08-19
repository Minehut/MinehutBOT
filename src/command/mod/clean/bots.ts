import { Message, NewsChannel, TextChannel } from 'discord.js';
import { MinehutCommand } from '../../../structure/command/minehutCommand';
import { PermissionLevel } from '../../../util/permission/permissionLevel';

export default class CleanBotsCommand extends MinehutCommand {
	constructor() {
		super('clean-bots', {
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.Moderator,
			description: {
				content: 'Clean x amount of bot messages',
				usage: '<count>',
			},
			args: [
				{
					id: 'count',
					type: (_msg, phrase) => {
						if (!phrase || isNaN(parseInt(phrase))) return null;
						const num = parseInt(phrase);
						if (num < 2 || num > 100) return null;
						return num;
					},
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, how many messages do you want to clean? (2-100)`,
						retry: (msg: Message) =>
							`${msg.author}, please enter a number between 2 and 100.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { count }: { count: number }) {
		const messages = await msg.channel.messages.fetch();
		const filtered = [
			...messages
				.filter(m => m.author.bot && m.id !== msg.id)
				.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
				.values(),
		].slice(0, count);
		const channel = msg.channel as TextChannel | NewsChannel;
		await channel.bulkDelete(filtered);
		const bmsg = await msg.channel.send(
			`:ok_hand: deleted ${filtered.length} messages`
		);
		setTimeout(() => {
			msg.delete().catch(() => {});
			bmsg.delete().catch(() => {});
		}, 5000);
	}
}
