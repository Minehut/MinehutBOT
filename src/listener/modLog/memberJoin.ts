import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { GuildMember } from 'discord.js';
import { sendModLogMessage } from '../../util/functions';

export default class ModLogMemberJoinListener extends Listener {
	constructor() {
		super('modLogMemberJoin', {
			emitter: 'client',
			event: 'guildMemberAdd',
		});
	}

	async exec(member: GuildMember) {
		const config = guildConfigs.get(member.guild.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('memberJoin')
		)
			return;
		await sendModLogMessage(
			member.guild,
			`:inbox_tray: ${member.user.tag} (\`${member.id}\`) joined`
		);
	}
}
