import { GuildMember } from 'discord.js';
import MinehutClient from '../../client/MinehutClient';
import { MainDiscordRole } from './role/MainDiscordRole';
import { PermissionLevel } from './PermissionLevel';
import { StaffDiscordRole } from './role/StaffDiscordRole';

export default function getPermissionLevel(
	member: GuildMember,
	client: MinehutClient
) {
	if (client.ownerIds?.includes(member.id)) return PermissionLevel.BotDeveloper;
	const roles = member.roles.cache.filter(
		r =>
			Object.values(MainDiscordRole).some(v => v === r.id) ||
			Object.values(StaffDiscordRole).some(v => v === r.id)
	);
	if (roles.size < 1) return PermissionLevel.Everyone;
	const highestRole = roles.sort((a, b) => a.position - b.position).last();

	switch (highestRole!.id) {
		case MainDiscordRole.Muted:
			return PermissionLevel.Muted;

		case MainDiscordRole.DJ:
			return PermissionLevel.DJ;

		case MainDiscordRole.Verified:
			return PermissionLevel.Verified;

		case MainDiscordRole.BoostersPass:
			return PermissionLevel.BoostersPass;

		case StaffDiscordRole.NitroBooster:
		case MainDiscordRole.NitroBooster:
			return PermissionLevel.NitroBooster;

		case StaffDiscordRole.Advisor:
		case MainDiscordRole.Advisor:
			return PermissionLevel.Advisor;

		case StaffDiscordRole.SuperLeague:
		case MainDiscordRole.SuperLeague:
			return PermissionLevel.SuperLeague;

		case MainDiscordRole.YouTube:
			return PermissionLevel.YouTube;

		case StaffDiscordRole.Builder:
		case MainDiscordRole.BuildTeam:
			return PermissionLevel.BuildTeam;

		case StaffDiscordRole.Robot:
		case MainDiscordRole.Robot:
			return PermissionLevel.Robot;

		case StaffDiscordRole.JuniorModerator:
		case MainDiscordRole.JuniorModerator:
			return PermissionLevel.JuniorModerator;

		case StaffDiscordRole.Moderator:
		case MainDiscordRole.Moderator:
			return PermissionLevel.Moderator;

		case StaffDiscordRole.SeniorModerator:
		case MainDiscordRole.SeniorModerator:
			return PermissionLevel.SeniorModerator;

		case StaffDiscordRole.Manager:
		case MainDiscordRole.Manager:
			return PermissionLevel.Manager;

		case StaffDiscordRole.Developer:
			return PermissionLevel.Developer;

		case StaffDiscordRole.Admin:
		case MainDiscordRole.Admin:
			return PermissionLevel.Admin;

		default:
			return PermissionLevel.Everyone;
	}
}
