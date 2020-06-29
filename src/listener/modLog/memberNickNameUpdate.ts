import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/guildConfigs';
import { sendModLogMessage } from '../../util/util';
import { GuildMember } from 'discord.js';

export default class ModLogMemberNickNameUpdateListener extends Listener {
	constructor() {
		super('modLogMemberNickNameUpdateListener', {
			emitter: 'client',
			event: 'guildMemberUpdate',
		});
	}

	async exec(oldMember: GuildMember, newMember: GuildMember) {
		guildConfigs.forEach(async config => {
			if (
				!config ||
				!config.features.modLog ||
				!config.features.modLog.events.includes('memberNickNameUpdate') ||
				oldMember.nickname === newMember.nickname
			)
				return;
			const guild = this.client.guilds.cache.get(config.id);
			if (!guild) return;
			if (oldMember.nickname && !newMember.nickname)
				return await sendModLogMessage(
					guild,
					`:name_badge: ${oldMember.user.tag} (\`${oldMember.id}\`) removed nick \`${oldMember.nickname}\``
				);
			else if (!oldMember.nickname && newMember.nickname)
				return await sendModLogMessage(
					guild,
					`:name_badge: ${oldMember.user.tag} (\`${oldMember.id}\`) added nick \`${newMember.nickname}\``
				);
			else if (oldMember.nickname !== newMember.nickname)
				return await sendModLogMessage(
					guild,
					`:name_badge: ${oldMember.user.tag} (\`${oldMember.id}\`) changed nick to \`${newMember.nickname}\` from \`${oldMember.nickname}\``
				);
		});
	}
}
