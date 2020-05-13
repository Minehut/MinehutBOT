import { GuildConfiguration } from './guildConfiguration';

export const guildConfigs: Map<string, GuildConfiguration> = new Map();

guildConfigs.set('608978588976283660', {
	// bot testing
	id: '608978588976283660',
	prefix: 'test!',
	roles: {
		juniorModerator: '701854457331187763',
		admin: '701854509164527707',
	},
});

guildConfigs.set('minehut staff guild id', {
	// Minehut Staff
	id: 'minehut staff guild id',
	roles: {
		nitroBooster: '626966014520852520',
		advisor: '550144265850716160',
		superLeague: '395989661232791553',
		robot: '566034751333335070',
		builder: '502214335725174790',
		staff: '615653607274184723',
		mentor: '678685808282173449',
		juniorModerator: '396472533668462592',
		moderator: '391351349893136394',
		seniorModerator: '396139742368104457',
		developer: '391351204187340821',
		manager: '591669127819821067',
		admin: '391351275805081600',
	},
});

guildConfigs.set('239599059415859200', {
	// Main Minehut discord
	id: '239599059415859200',
	roles: {
		muted: '274899318291431424',
		dj: '597138002158026764',
		verified: '585153447993802783',
		boostersPass: '616678743749951526',
		nitroBooster: '585533517639712790',
		advisor: '529834985453125644',
		superLeague: '470655938018279448',
		youTube: '588769186621161503',
		buildTeam: '502570149157797898',
		robot: '394262717663412224',
		juniorModerator: '276887063683399680',
		moderator: '246487117000212480',
		seniorModerator: '291735862759129088',
		manager: '591722355273760825',
		admin: '240228183985618954',
	},
});