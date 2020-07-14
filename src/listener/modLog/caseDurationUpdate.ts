import { Listener } from 'discord-akairo';
// import { guildConfigs } from '../../guild/guildConfigs';
// import { Message } from 'discord.js';
// import { sendModLogMessage } from '../../util/util';
// import { Command } from 'discord-akairo';
// import { TextChannel } from 'discord.js';
// import { Util } from 'discord.js';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { sendModLogMessage, prettyDate } from '../../util/functions';
import humanizeDuration from 'humanize-duration';
import { FOREVER_MS } from '../../util/constants';

export default class ModLogCaseDurationUpdateListener extends Listener {
	constructor() {
		super('modLogCaseDurationUpdate', {
			emitter: 'client',
			event: 'caseUpdate',
		});
	}

	async exec(
		oldCase: DocumentType<Case>,
		newCase: DocumentType<Case>,
		member: GuildMember
	) {
		const config = guildConfigs.get(member.guild.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('caseDurationUpdate') ||
			oldCase.expiresAt === newCase.expiresAt
		)
			return;
		const oldDuration =
			oldCase.expiresAt.getTime() - oldCase.createdAt.getTime();
		const newDuration =
			newCase.expiresAt.getTime() - newCase.createdAt.getTime();
		const humanReadableNewDuration =
			newDuration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(newDuration, { largest: 3, round: true });
		const humanReadableOldDuration =
			oldDuration === FOREVER_MS
				? 'permanent'
				: humanizeDuration(oldDuration, { largest: 3, round: true });
		await sendModLogMessage(
			member.guild,
			`:pencil2: case \`${newCase.id}\` duration edited by ${
				member.user.tag
			} (\`${
				member.id
			}\`): \n**Old:** ${humanReadableOldDuration} (expires: ${prettyDate(
				new Date(oldCase.expiresAt)
			)})\n**New:** ${humanReadableNewDuration} (expires: ${prettyDate(
				new Date(newCase.expiresAt)
			)})`
		);
	}
}
