import { Message } from 'discord.js';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { TagModel } from '../../model/tag';

export default class FixTagsCommand extends MinehutCommand {
	constructor() {
		super('fixTags', {
			aliases: ['fixtags'],
			category: 'utility',
			description: {
				content: 'Fix tags',
			},
		});
	}

	async exec(msg: Message) {
		(await TagModel.find()).forEach(async t => {
			if (t.aliases[0] !== undefined) {
				await t.updateOne({ aliases: t.aliases[0] });
			}
		});
		await msg.channel.send('done');
	}
}
