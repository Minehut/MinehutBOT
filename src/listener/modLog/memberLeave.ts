import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/guildConfigs';
import { GuildMember } from 'discord.js';
import { sendModLogMessage } from '../../util/util';

export default class ModLogMemberLeaveListener extends Listener {
	constructor() {
		super('modLogMemberLeave', {
			emitter: 'client',
			event: 'guildMemberRemove',
		});
	}

	async exec(member: GuildMember) {
		const config = guildConfigs.get(member.guild.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('memberLeave')
		)
			return;
		await sendModLogMessage(
			member.guild,
			`:outbox_tray: ${member.user.tag} (\`${member.id}\`) left`
		);
	}
}
