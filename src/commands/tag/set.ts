import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { messages } from '../../util/constants/messages';

export default class TagSetCommand extends Command {
	constructor() {
		super('tag-set', {
			aliases: ['tag-set'],
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Set/edit a tag',
				usage: '<name> <content>',
			},
			args: [
				{
					id: 'name',
					type: 'tagName',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.set.namePrompt.start(msg.author),
					},
				},
				{
					id: 'content',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							messages.commands.tag.set.contentPrompt.start(msg.author),
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ name, content }: { name: string; content: string }
	) {
		name = name.replace(/\s+/g, '-').toLowerCase();
		msg.reply(`You want to set \`${name}\` to \`\`\`${content}\`\`\`?`);
	}
}
