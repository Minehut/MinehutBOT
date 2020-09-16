import { GuildMember } from 'discord.js';
import { MinehutClient } from '../../client/minehutClient';
import { PermissionLevel } from './permissionLevel';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { RoleType } from './roleType';
import getRoleTypeById from './getRoleTypeById';

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

	switch (roleType) {
		case RoleType.Muted:
			return PermissionLevel.Muted;

		case RoleType.DJ:
			return PermissionLevel.DJ;

		case RoleType.Verified:
			return PermissionLevel.Verified;

		case RoleType.BoostersPass:
			return PermissionLevel.BoostersPass;

		case RoleType.NitroBooster:
			return PermissionLevel.NitroBooster;

		case RoleType.Support:
			return PermissionLevel.Support;

		case RoleType.Advisor:
			return PermissionLevel.Advisor;

		case RoleType.SuperLeague:
			return PermissionLevel.SuperLeague;

		case RoleType.YouTube:
			return PermissionLevel.YouTube;

		case RoleType.Robot:
			return PermissionLevel.Robot;

		case RoleType.JuniorModerator:
			return PermissionLevel.JuniorModerator;

		case RoleType.Moderator:
			return PermissionLevel.Moderator;

		case RoleType.SeniorModerator:
			return PermissionLevel.SeniorModerator;

		case RoleType.Manager:
			return PermissionLevel.Manager;

		case RoleType.Developer:
			return PermissionLevel.Developer;

		case RoleType.Admin:
			return PermissionLevel.Admin;

		default:
			return PermissionLevel.Everyone;
	}
}
