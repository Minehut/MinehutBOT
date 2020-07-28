import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import {
	sendModLogMessage,
	removeMarkdownAndMentions,
	CensorCheckResponse,
} from '../../util/functions';
import { Message } from 'discord.js';
import { TextChannel } from 'discord.js';
import _ from 'lodash';
import { CensorRuleType } from '../../util/censorRules';

export default class ModLogMessageCensorListener extends Listener {
	constructor() {
		super('modLogMessageCensor', {
			emitter: 'client',
			event: 'messageCensor',
		});
	}

	async exec(msg: Message, filter: CensorCheckResponse) {
		if (!msg.guild) return;
		const config = guildConfigs.get(msg.guild!.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('messageCensor') ||
			msg.author.id === this.client.user!.id ||
			(config.features.modLog.ignoredChannels &&
				config.features.modLog.ignoredChannels.includes(msg.channel.id))
		)
			return;
		const messageString = msg.content
			.trim()
			.replace(/[\u200B-\u200D\uFEFF]/g, '')
			.replace(new RegExp(filter.rule.rule, 'i'), '>>>$1<<<');
		await sendModLogMessage(
			msg.guild!,
			`:no_entry_sign: censored ${CensorRuleType[
				filter.rule.type
			].toUpperCase()} message by ${msg.author.tag} (\`${
				msg.author.id
			}\`) in **#${(msg.channel as TextChannel).name}**: (\`${
				msg.id
			}\`) ${removeMarkdownAndMentions(messageString)}`
		);
	}
}
