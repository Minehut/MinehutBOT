import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { TagModel } from '../models/Tag';

export default class TagListener extends Listener {
	public constructor() {
		super('tag', {
			emitter: 'commandHandler',
			event: 'messageInvalid',
			category: 'commandHandler',
		});
	}

	public async exec(msg: Message) {
		if (msg.guild && msg.util?.parsed?.prefix) {
			if (!msg.util?.parsed?.alias || !msg.util?.parsed?.afterPrefix) return;
			const name = msg.util?.parsed?.afterPrefix.split(' ')[0];
			const tag = await TagModel.findOne({
				$or: [{ name }, { aliases: { $in: [name] } }],
			});
			if (!tag) return;
			const command = this.client.commandHandler.modules.get('tag-show')!;
			return this.client.commandHandler.runCommand(
				msg,
				command,
				await command.parse(msg, msg.util?.parsed?.afterPrefix)
			);
		}
	}
}
