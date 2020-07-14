import { Listener } from 'discord-akairo';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { sendModLogMessage } from '../../util/functions';

export default class ModLogCaseReasonUpdateListener extends Listener {
	constructor() {
		super('modLogCaseReasonUpdate', {
			emitter: 'client',
			event: 'caseUpdate',
		});
	}

	async exec(
		oldCase: DocumentType<Case>,
		newCase: DocumentType<Case>,
		member: GuildMember
	) {
		const config = guildConfigs.get(oldCase.guild);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('caseReasonUpdate') ||
			oldCase.reason === newCase.reason
		)
			return;
		await sendModLogMessage(
			member.guild,
			`:pencil2: case \`${newCase.id}\` reason edited by ${member.user.tag} (\`${member.id}\`): \n**Old:** ${oldCase.reason}\n**New:** ${newCase.reason}`
		);
	}
}
