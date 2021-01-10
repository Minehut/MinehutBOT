import { GuildConfiguration } from './guildConfiguration';
import { ALL_MODLOG_EVENTS, HASTEBIN_EXTENSIONS_WHITELIST, INVITE_WHITELIST } from './common';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export const guildConfigs: Map<string, GuildConfiguration> = new Map();

// Main Minehut discord
guildConfigs.set('239599059415859200', {
	id: '239599059415859200',
	main: true,
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
		helper: '726663955065470997',
		robot: '394262717663412224',
		superHelper: '276887063683399680',
		moderator: '246487117000212480',
		seniorModerator: '291735862759129088',
		manager: '591722355273760825',
		admin: '240228183985618954',
	},
	features: {
		announcement: {
			announcers: [
				{
					role: '493253127366115360',
					channel: '499340530199560192',
					name: 'event',
				},
			],
		},
		censor: {
			inviteWhitelist: INVITE_WHITELIST,
			overrides: [
				{
					id: '616367029053554708', // Private category (incl. boosters)
					type: 'category',
					config: {
						allowSwearing: true,
						allowZalgo: true,
					},
				},
				{
					id: '364462035833978881', // Staff category
					type: 'category',
					config: {
						allowSwearing: true,
						allowCopyPasta: true,
						allowInvites: true,
						allowZalgo: true,
					},
				},
			],
		},
		modLog: {
			channel: '480889821225549824',
			events: ALL_MODLOG_EVENTS,
			prefix: '',
			ignoredChannels: ['601544975221653514'], // #count-to-1mil
		},
		reactionRole: {
			channel: '364453066277388289',
			roles: [
				{ roleId: '493861300363984916', emoji: '📰' },
				{ roleId: '496790951537278996', emoji: '📺' },
				{ roleId: '493253127366115360', emoji: 'HypeBadge' },
			],
		},
		boosterPass: {
			maximumGrantedBoosterPasses: 2,
		},
		hastebinConversion: {
			ignoredChannels: ['480889821225549824'],
			whitelistedExtensions: HASTEBIN_EXTENSIONS_WHITELIST
		}
	},
});

// Minehut Staff
guildConfigs.set('370014721556086794', {
	id: '370014721556086794',
	roles: {
		nitroBooster: '626966014520852520',
		advisor: '550144265850716160',
		superLeague: '395989661232791553',
		robot: '566034751333335070',
		builder: '502214335725174790',
		staff: '615653607274184723',
		mentor: '678685808282173449',
		helper: '396472533668462592',
		moderator: '391351349893136394',
		seniorModerator: '396139742368104457',
		developer: '391351204187340821',
		manager: '591669127819821067',
		admin: '391351275805081600',
	},
	features: {
		modLog: {
			channel: '480889821225549824',
			events: ALL_MODLOG_EVENTS,
			prefix: '`[STAFF]`',
		},
	},
});

// Minehut Nexus
guildConfigs.set('715281101479739543', {
	id: '715281101479739543',
	roles: {
		nitroBooster: '716600433606524970',
		superLeague: '723772948342767647',
		robot: '717558456265211944',
		moderator: '715281911529996430',
		seniorModerator: '715281850385301616',
		manager: '732327323780513902',
		admin: '715281797017108531'
	},
	features: {
		modLog: {
			channel: '480889821225549824',
			events: ALL_MODLOG_EVENTS,
			prefix: '`[NEXUS]`',
		},
	},
});

// Minehut Meta
guildConfigs.set('546414872196415501', {
	id: '546414872196415501',
	roles: {
		nitroBooster: '639198630800130079',
		superLeague: '728320626670043257',
		robot: '546490078571266050',
		moderator: '737150217476112424',
		seniorModerator: '546415221212839947',
		manager: '737496310793371734',
		admin: '647224295554023446',
	},
	features: {
		modLog: {
			channel: '548317804076597249',
			events: ALL_MODLOG_EVENTS.filter(e => e !== 'memberUserNameUpdate'),
			prefix: '',
		},
		censor: {
			inviteWhitelist: INVITE_WHITELIST,
			allowSwearing: true,
			minimumChatPermission: PermissionLevel.Everyone,
			overrides: [],
		},
		autoReact: {
			channels: [
				{
					channel: '744075635114115142', // #meta-feedback
					reactions: [':yes:546435721444196353', ':no:546435753719103488'],
					allowMessageAuthorReacting: false,
					allowMultipleUserReactions: false,
				},
				{
					channel: '754091669548171357', // #filter-requests
					reactions: [':yes:546435721444196353', ':no:546435753719103488'],
					allowMessageAuthorReacting: false,
					allowMultipleUserReactions: false,
				},
			],
		},
		hastebinConversion: {
			ignoredChannels: ['548317804076597249'],
			whitelistedExtensions: HASTEBIN_EXTENSIONS_WHITELIST
    },
		githubIssue: {
			githubRepoOwner: "Minehut",
			githubRepoName: "Meta",
		},
	},
});

// Minehut Creators
guildConfigs.set('721155702915072040', {
	id: '721155702915072040',
	roles: {
		superLeague: '721170251236245525',
		robot: '732835610133528608',
		moderator: '721170156008767560',
		admin: '721170351446425681',
	},
	features: {
		modLog: {
			channel: '721171219348717679',
			events: ALL_MODLOG_EVENTS,
			prefix: '',
		},
	},
});
