import { Listener } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { sendModLogMessage, arrayDiff } from '../../util/functions';
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
		const config = guildConfigs.get(oldMember.guild.id);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('memberRolesUpdate') ||
			oldMember.roles === newMember.roles
		)
			return;
		const { added, removed }: { added: Role[]; removed: Role[] } = arrayDiff(
			[...oldMember.roles.cache.values()],
			[...newMember.roles.cache.values()]
		);
		if (added.length === 0 && removed.length === 0) return; // Both role lists are empty - Did they just join the guild?
		const diffString = `${added
			.map(r => `**+** ${r.name} (\`${r.id}\`)`)
			.join('\n')}${removed
			.map(r => `**-** ${r.name} (\`${r.id}\`)`)
			.join('\n')}`;
		await sendModLogMessage(
			newMember.guild,
			`:briefcase: roles updated for ${newMember.user.tag} (\`${newMember.id}\`):\n${diffString}`
		);
	}
}
