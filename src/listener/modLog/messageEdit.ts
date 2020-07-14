import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import {
	sendModLogMessage,
	removeMarkdownAndMentions,
} from '../../util/functions';
import { Message } from 'discord.js';
import { TextChannel } from 'discord.js';

export default class ModLogMessageEditListener extends Listener {
	constructor() {
		super('modLogMessageEdit', {
			emitter: 'client',
			event: 'messageUpdate',
		});
	}

	async exec(oldMsg: Message, newMsg: Message) {
		if (!oldMsg.guild) return;
		const config = guildConfigs.get(oldMsg.guild!.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('messageDelete') ||
			oldMsg.author.id === this.client.user!.id ||
			(config.features.modLog.ignoredChannels &&
				config.features.modLog.ignoredChannels.includes(oldMsg.channel.id)) ||
			oldMsg.content === newMsg.content
		)
			return;
		await sendModLogMessage(
			oldMsg.guild!,
			`:pencil: ${oldMsg.author.tag} (\`${
				oldMsg.author.id
			}\`) message edited in **#${(oldMsg.channel as TextChannel).name}**: (\`${
				oldMsg.id
			}\`)\n**Old:** ${removeMarkdownAndMentions(
				oldMsg.content,
				oldMsg
			)}\n**New:** ${removeMarkdownAndMentions(newMsg.content, newMsg)}`
		);
	}
}
