import { GuildMember } from "discord.js";
import { guildConfigs } from "../../guild/config/guildConfigs";
import getRoleTypeById from "./getRoleTypeById";
import { PermissionLevel } from "./permissionLevel";

export function hasPermissionLevelRole(permissionLevel: PermissionLevel, member: GuildMember) {
    let allRoles: string[] = [];
	guildConfigs.forEach(
		g => (allRoles = allRoles.concat(Object.values(g.roles) as string[]))
	);
    const roles = member.roles.cache.filter(memberRole =>
		allRoles.includes(memberRole.id)
	);
    return roles.filter(r => 
        getRoleTypeById(r.id) == permissionLevel
    ).size > 0;
}