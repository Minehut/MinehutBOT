import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { Message } from 'discord.js';
import { sendModLogMessage } from '../../util/functions';
import { Command } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { Util } from 'discord.js';

export default class ModLogCommandListener extends Listener {
	constructor() {
		super('modLogCommand', {
			emitter: 'commandHandler',
			event: 'commandStarted',
		});
	}

	async exec(msg: Message, _command: Command, _args: any[]) {
		if (!msg.guild) return;
		const config = guildConfigs.get(msg.guild.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('command') ||
			(config.features.modLog.ignoredChannels &&
				config.features.modLog.ignoredChannels.includes(msg.channel.id))
		)
			return;
		await sendModLogMessage(
			msg.guild,
			`:wrench: ${msg.author.tag} (\`${msg.author.id}\`) used command in **#${
				(msg.channel as TextChannel).name
			}**: \`${Util.escapeInlineCode(msg.cleanContent)}\``
		);
	}
}
