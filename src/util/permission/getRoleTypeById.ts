import { guildConfigs } from "../../guild/config/guildConfigs";

export default function getRoleTypeById(id: string) {
	let roleType: string | null = null;
	guildConfigs.forEach(g =>
		Object.keys(g.roles).forEach(k => {
			if (g.roles[k] === id) roleType = k;
		})
	);
	return roleType;

}