import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import {
	sendModLogMessage,
	removeMarkdownAndMentions,
	prettyDate,
} from '../../util/functions';
import { Message, User } from 'discord.js';
import { TextChannel } from 'discord.js';
import _ from 'lodash';

export default class ModLogMessageDeleteListener extends Listener {
	constructor() {
		super('modLogMessageDelete', {
			emitter: 'client',
			event: 'messageDelete',
		});
	}

	async exec(msg: Message) {
		if (!msg.guild) return;
		const config = guildConfigs.get(msg.guild!.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('messageDelete') ||
			msg.author.id === this.client.user!.id ||
			(config.features.modLog.ignoredChannels &&
				config.features.modLog.ignoredChannels.includes(msg.channel.id))
		)
			return;
		const auditLogs = await msg.guild.fetchAuditLogs();
		let deletedBy: User | null = null;
		const auditLogEntry = auditLogs.entries
			.filter(v => v.action == 'MESSAGE_DELETE')
			.first();
		if (auditLogEntry) deletedBy = auditLogEntry.executor;
		await sendModLogMessage(
			msg.guild!,
			`:wastebasket: ${msg.author.tag} (\`${
				msg.author.id
			}\`) message deleted in **#${(msg.channel as TextChannel).name}** ${
				deletedBy ? `by ${deletedBy.tag} (\`${deletedBy.id}\`)` : ''
			}: (\`${msg.id}\`) ${removeMarkdownAndMentions(
				msg.content
			)} (sent at ${prettyDate(msg.createdAt, false)})`,
			_.take(
				msg.attachments.map(a => a.proxyURL),
				20
			)
		);
	}
}
