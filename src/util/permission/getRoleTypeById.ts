import { guildConfigs } from '../../guild/config/guildConfigs';

export function getRoleTypeById(id: string): string | null {
	let roleType: string | null = null;
	guildConfigs.forEach(g =>
		Object.keys(g.roles).forEach(k => {
			if (g.roles[k] === id) roleType = k;
		})
	);
	return roleType;
}
