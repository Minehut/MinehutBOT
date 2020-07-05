import { Listener } from 'discord-akairo';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { sendModLogMessage } from '../../util/functions';

export default class ModLogCaseDeleteListener extends Listener {
	constructor() {
		super('modLogCaseDelete', {
			emitter: 'client',
			event: 'caseDelete',
		});
	}

	async exec(c: DocumentType<Case>, member: GuildMember) {
		const config = guildConfigs.get(c.guildId);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('caseDelete')
		)
			return;
		await sendModLogMessage(
			member.guild,
			`:wastebasket: case \`${c.id}\` deleted by ${member.user.tag} (\`${member.id}\`)`
		);
	}
}
