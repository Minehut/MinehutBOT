import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { sendModLogMessage } from '../../util/functions';
import { User } from 'discord.js';

export default class ModLogMemberUserNameUpdateListener extends Listener {
	constructor() {
		super('modLogMemberUserNameUpdateListener', {
			emitter: 'client',
			event: 'userUpdate',
		});
	}

	async exec(oldUser: User, newUser: User) {
		guildConfigs.forEach(async config => {
			if (
				!config ||
				!config.features.modLog ||
				!config.features.modLog.events.includes('memberUserNameUpdate') ||
				oldUser.username === newUser.username
			)
				return;
			const guild = this.client.guilds.cache.get(config.id);
			if (!guild || !guild.members.resolve(newUser.id)) return;
			await sendModLogMessage(
				guild,
				`:name_badge: ${oldUser.tag} (\`${oldUser.id}\`) changed username to \`${newUser.tag}\``
			);
		});
	}
}
