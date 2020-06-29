import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/guildConfigs';
import { sendModLogMessage, arrayDiff } from '../../util/util';
import { GuildMember } from 'discord.js';
import { Role } from 'discord.js';

export default class ModLogMemberRolesUpdateListener extends Listener {
	constructor() {
		super('modLogMemberRolesUpdate', {
			emitter: 'client',
			event: 'guildMemberUpdate',
		});
	}

	async exec(oldMember: GuildMember, newMember: GuildMember) {
		guildConfigs.forEach(async config => {
			if (
				!config ||
				!config.features.modLog ||
				!config.features.modLog.events.includes('memberRolesUpdate') ||
				oldMember.roles === newMember.roles
			)
				return;
			const guild = this.client.guilds.cache.get(config.id);
			if (!guild) return;
			const { added, removed }: { added: Role[]; removed: Role[] } = arrayDiff(
				oldMember.roles.cache.array(),
				newMember.roles.cache.array()
			);
			const diffString = `${added
				.map(r => `**+** ${r.name} (\`${r.id}\`)`)
				.join('\n')}${removed
				.map(r => `**-** ${r.name} (\`${r.id}\`)`)
				.join('\n')}`;
			await sendModLogMessage(
				newMember.guild,
				`:briefcase: roles updated for ${newMember.user.tag} (\`${newMember.id}\`):\n${diffString}`
			);
		});
	}
}
