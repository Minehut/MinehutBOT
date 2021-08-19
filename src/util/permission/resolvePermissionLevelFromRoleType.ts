import { PermissionLevel } from './permissionLevel';
import { RoleType } from './roleType';

export function resolvePermissionLevelFromRoleType(roleType: string) {
	switch (roleType) {
		case RoleType.Muted:
			return PermissionLevel.Muted;

		case RoleType.DJ:
			return PermissionLevel.DJ;

		case RoleType.BoostersPass:
			return PermissionLevel.BoostersPass;

		case RoleType.NitroBooster:
			return PermissionLevel.NitroBooster;

		case RoleType.Advisor:
			return PermissionLevel.Advisor;

		case RoleType.SuperLeague:
			return PermissionLevel.SuperLeague;

		case RoleType.YouTube:
			return PermissionLevel.YouTube;

		case RoleType.Robot:
			return PermissionLevel.Robot;

		case RoleType.Moderator:
			return PermissionLevel.Moderator;

		case RoleType.Developer:
			return PermissionLevel.Developer;

		case RoleType.Admin:
			return PermissionLevel.Admin;

		default:
			return PermissionLevel.Everyone;
	}
}
