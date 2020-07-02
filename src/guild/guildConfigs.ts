import { GuildConfiguration } from './guildConfiguration';

export const guildConfigs: Map<string, GuildConfiguration> = new Map();

const allEvents = [
	'memberJoin', //added
	'memberLeave', //added
	'memberUserNameUpdate', //added
	'memberNickNameUpdate', //added
	'messageDelete', //added
	'messageEdit', //added
	'messageCensor',
	'caseCreate', //added
	'caseDelete', //added
	'caseReasonUpdate', //added
	'caseDurationUpdate', //added
	'memberRolesUpdate', //added
	'command', //added
];

guildConfigs.set('395189137981964288', {
	id: '395189137981964288',
	prefix: '!',
	roles: {},
	features: {},
});

guildConfigs.set('608978588976283660', {
	// bot testing
	id: '608978588976283660',
	prefix: '!',
	roles: {
		juniorModerator: '701854457331187763',
		admin: '701854509164527707',
		muted: '615630839438508062',
	},
	features: {
		modLog: {
			channel: '726598891759468554',
			events: allEvents,
			prefix: '',
			ignoredChannels: [],
		},
		reactionRole: {
			channel: '728201493555052641',
			roles: [
				{ roleId: '728202487672078368', emoji: '🤔' },
				{ roleId: '728202547944357958', emoji: 'PepeClown' },
			],
		},
	},
});

guildConfigs.set('370014721556086794', {
	// Minehut Staff
	id: '370014721556086794',
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
	features: {},
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
	features: {},
});
