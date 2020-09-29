import { GuildMember } from 'discord.js';
import { MinehutClient } from '../../client/minehutClient';
import { PermissionLevel } from './permissionLevel';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { getRoleTypeById } from './getRoleTypeById';
import { resolvePermissionLevelFromRoleType } from './resolvePermissionLevelFromRoleType';

export function getPermissionLevel(member: GuildMember, client: MinehutClient) {
	// They have BotDeveloper perm level if they are in the bot owner list
	if (client.ownerIds?.includes(member.id)) return PermissionLevel.BotDeveloper;
	// We want to get a list of every significant role id from every guild
	let allRoles: string[] = [];
	guildConfigs.forEach(
		g => (allRoles = allRoles.concat(Object.values(g.roles) as string[]))
	);
	// We only want to look at roles that we know about from the member
	const roles = member.roles.cache.filter(memberRole =>
		allRoles.includes(memberRole.id)
	);
	// If they don't have any significant roles, they have Everyone perm level
	if (roles.size < 1) return PermissionLevel.Everyone;

	const highestRole = roles.sort((a, b) => a.position - b.position).last();
	const roleType = getRoleTypeById(highestRole?.id!);
	if (!roleType)
		throw new Error('Something weird happened, roleType is not defined');

	return resolvePermissionLevelFromRoleType(roleType);
}
