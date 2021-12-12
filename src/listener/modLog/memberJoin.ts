import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { GuildMember } from 'discord.js';
import { sendModLogMessage, prettyDate } from '../../util/functions';

const THIRTY_DAYS_MS = 2.592e9;

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
		const isNew = Date.now() - member.user.createdAt.getTime() < THIRTY_DAYS_MS;
		await sendModLogMessage(
			member.guild,
			`:inbox_tray: ${isNew ? ':new: ' : ''}${member.user.tag} (\`${
				member.id
			}\`) joined (account created: ${prettyDate(member.user.createdAt)}) (#${member.guild.memberCount})`
		);
	}
}
