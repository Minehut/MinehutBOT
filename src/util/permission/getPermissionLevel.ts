import { GuildMember } from 'discord.js';
import { MinehutClient } from '../../client/minehutClient';
import { MainDiscordRole } from './role/mainDiscordRole';
import { PermissionLevel } from './permissionLevel';
import { StaffDiscordRole } from './role/staffDiscordRole';
import { TestDiscordRole } from './role/testDiscordRole';

export function getPermissionLevel(member: GuildMember, client: MinehutClient) {
	if (client.ownerIds?.includes(member.id)) return PermissionLevel.BotDeveloper;
	const roles = member.roles.cache.filter(
		r =>
			Object.values(MainDiscordRole).some(v => v === r.id) ||
			Object.values(StaffDiscordRole).some(v => v === r.id) ||
			Object.values(TestDiscordRole).some(v => v === r.id)
	);
	if (roles.size < 1) return PermissionLevel.Everyone;
	const highestRole = roles.sort((a, b) => a.position - b.position).last();

	switch (highestRole!.id) {
		case TestDiscordRole.Muted:
		case MainDiscordRole.Muted:
			return PermissionLevel.Muted;

		case TestDiscordRole.DJ:
		case MainDiscordRole.DJ:
			return PermissionLevel.DJ;

		case TestDiscordRole.Verified:
		case MainDiscordRole.Verified:
			return PermissionLevel.Verified;

		case TestDiscordRole.BoostersPass:
		case MainDiscordRole.BoostersPass:
			return PermissionLevel.BoostersPass;

		case TestDiscordRole.NitroBooster:
		case StaffDiscordRole.NitroBooster:
		case MainDiscordRole.NitroBooster:
			return PermissionLevel.NitroBooster;

		case TestDiscordRole.Advisor:
		case StaffDiscordRole.Advisor:
		case MainDiscordRole.Advisor:
			return PermissionLevel.Advisor;

		case TestDiscordRole.SuperLeague:
		case StaffDiscordRole.SuperLeague:
		case MainDiscordRole.SuperLeague:
			return PermissionLevel.SuperLeague;

		case TestDiscordRole.YouTube:
		case MainDiscordRole.YouTube:
			return PermissionLevel.YouTube;

		case TestDiscordRole.YouTube:
		case StaffDiscordRole.Builder:
		case MainDiscordRole.BuildTeam:
			return PermissionLevel.BuildTeam;

		case TestDiscordRole.Robot:
		case StaffDiscordRole.Robot:
		case MainDiscordRole.Robot:
			return PermissionLevel.Robot;

		case TestDiscordRole.JuniorModerator:
		case StaffDiscordRole.JuniorModerator:
		case MainDiscordRole.JuniorModerator:
			return PermissionLevel.JuniorModerator;

		case TestDiscordRole.Moderator:
		case StaffDiscordRole.Moderator:
		case MainDiscordRole.Moderator:
			return PermissionLevel.Moderator;

		case TestDiscordRole.SeniorModerator:
		case StaffDiscordRole.SeniorModerator:
		case MainDiscordRole.SeniorModerator:
			return PermissionLevel.SeniorModerator;

		case TestDiscordRole.Manager:
		case StaffDiscordRole.Manager:
		case MainDiscordRole.Manager:
			return PermissionLevel.Manager;

		case TestDiscordRole.Developer:
		case StaffDiscordRole.Developer:
			return PermissionLevel.Developer;

		case TestDiscordRole.Admin:
		case StaffDiscordRole.Admin:
		case MainDiscordRole.Admin:
			return PermissionLevel.Admin;

		default:
			return PermissionLevel.Everyone;
	}
}
