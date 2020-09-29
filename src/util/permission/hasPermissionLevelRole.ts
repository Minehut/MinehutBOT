import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { getRoleTypeById } from './getRoleTypeById';
import { PermissionLevel } from './permissionLevel';
import { resolvePermissionLevelFromRoleType } from './resolvePermissionLevelFromRoleType';

export function hasPermissionLevelRole(
	permissionLevel: PermissionLevel,
	member: GuildMember
) {
	// We want to get a list of every significant role id from every guild
	let allRoles: string[] = [];
	guildConfigs.forEach(
		g => (allRoles = allRoles.concat(Object.values(g.roles) as string[]))
	);
	// We only want to look at roles that we know about from the member
	const roles = member.roles.cache.filter(memberRole =>
		allRoles.includes(memberRole.id)
	);

	return roles.some(
		r =>
			resolvePermissionLevelFromRoleType(getRoleTypeById(r.id)!) ===
			permissionLevel
	);
}
