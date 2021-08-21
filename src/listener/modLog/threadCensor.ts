import { Listener } from 'discord-akairo';
import { TextChannel, ThreadChannel } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { CensorRuleType } from '../../util/censorRules';
import {
	CensorCheckResponse,
	removeMarkdownAndMentions,
	sendModLogMessage,
} from '../../util/functions';

export default class ModLogThreadCensorListener extends Listener {
	constructor() {
		super('modLogThreadCensor', {
			emitter: 'client',
			event: 'threadCensor',
		});
	}

	async exec(thread: ThreadChannel, filter: CensorCheckResponse) {
		const config = guildConfigs.get(thread.guildId);
		const threadOwner = await thread.fetchOwner();
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('threadCensor') ||
			threadOwner!.user!.id === this.client.user!.id ||
			(config.features.modLog.ignoredChannels &&
				config.features.modLog.ignoredChannels.includes(thread.parent!.id))
		)
			return;
		const nameString = thread.name
			.trim()
			.replace(/[\u200B-\u200D\uFEFF]/g, '')
			.replace(new RegExp(filter.rule.rule, 'i'), '>>>$1<<<');
		await sendModLogMessage(
			thread.guild,
			`:no_entry_sign: censored thread with ${CensorRuleType[
				filter.rule.type
			].toUpperCase()} title by ${threadOwner!.user!.tag} (\`${
				threadOwner!.user!.id
			}\`) in **#${(thread.parent! as TextChannel).name}**: (\`${
				thread.id
			}\`) ${removeMarkdownAndMentions(nameString)}`
		);
	}
}
