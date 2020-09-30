import { MinehutCommand } from '../../structure/command/minehutCommand';
import { Message } from 'discord.js';
import { PrefixSupplier } from 'discord-akairo';
import { MESSAGES } from '../../util/constants';
import { Flag } from 'discord-akairo';

export default class BoosterPassCommand extends MinehutCommand {
	constructor() {
		super('boosterPass', {
			aliases: ['boosterpass', 'bp'],
			description: {
				content: `Give, revoke, or retrieve info on booster passes
                Available subcommands:
                • **give** \`<member>\`
                • **info** \`<member>\`
                • **revoke** \`<member>\`
                • **import**
                `,
				usage: '<method> <...arguments>',
				examples: [
					'give @Facto',
					'give 535986058991501323',
					'info @Facto',
					'info 535986058991501323',
					'revoke @Facto',
					'revoke 535986058991501323',
					'import',
				],
			},
			category: 'boosterpass',
			channel: 'guild',
		});
	}

	*args() {
		const method = yield {
			type: [
				['boosterpass-give', 'give'],
				['boosterpass-revoke', 'revoke'],
				['boosterpass-info', 'info'],
				['boosterpass-import', 'import'],
			],
			otherwise: (msg: Message) => {
				const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
				return MESSAGES.commands.useHelp(prefix, this.aliases[0]);
			},
		};

		return Flag.continue(method);
	}
}
