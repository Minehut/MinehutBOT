import { GuildConfiguration } from './guildConfiguration';
import {
	ALL_MODLOG_EVENTS,
	HASTEBIN_EXTENSIONS_WHITELIST,
	INVITE_WHITELIST,
} from './common';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export const guildConfigs: Map<string, GuildConfiguration> = new Map();

// Main Minehut discord
guildConfigs.set('239599059415859200', {
	id: '239599059415859200',
	main: true,
	roles: {
		muted: '274899318291431424',
		dj: '597138002158026764',
		boostersPass: '616678743749951526',
		nitroBooster: '585533517639712790',
		advisor: '529834985453125644',
		superLeague: '470655938018279448',
		youTube: '588769186621161503',
		robot: '394262717663412224',
		moderator: '246487117000212480',
		developer: '798579028100775947',
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
				{ roleId: '493861300363984916', emoji: '📰' }, // changelog
				{ roleId: '496790951537278996', emoji: '📺' }, // media
				{ roleId: '493253127366115360', emoji: '🧑‍🤝‍🧑' }, // community
				{ roleId: '822168311944052777', emoji: '🌩️' }, // status
				{ roleId: '822168468027736105', emoji: '🛒' }, // marketplace
			],
		},
		boosterPass: {
			maximumGrantedBoosterPasses: 2,
		},
		hastebinConversion: {
			ignoredChannels: ['480889821225549824'],
			whitelistedExtensions: HASTEBIN_EXTENSIONS_WHITELIST,
		},
		starboard: {
			channel: '805566446527709244',
			triggerAmount: 10,
			minimumPermLevel: PermissionLevel.NitroBooster,
			ignoredChannels: [
				'412394499919052810', // #support
				'364448476458778625', // #marketplace
				'240274910688051211', // #servers
				'480888099547774976', // #staff
			],
		},
		channelLockdown: {
			allFlagChannels: [
				'364502598805356545', // #general
				'373902459883749376', // #random
				'412394499919052810', // #community-help
				'822170697676750908', // #community-help-2
				'480896531453706240', // #botcmds
				'240274910688051211', // #servers
				'364448476458778625', // #marketplace
				'601544975221653514', // #count-to-1mil
				'394312418374713344', // #mc-functions
				'394312589754105857', // #building
				'568531994485588007', // #art-gfx
				'400170127737356299', // #skript
				'660337933743816724', // #code
				'705481433996853248', // #voice
			],
			reactionPermissionIgnoredChannels: [
				'240274910688051211', // #servers
				'364448476458778625', // #marketplace
				'601544975221653514', // #count-to-1mill
				'805566446527709244', // #starboard
				'731886603173363769', // #rules
				'364453066277388289', // #info
				'240269653358805003', // #updates
				'499340530199560192', // #community
				'822170056569782302', // #market
				'744243595632181268', // #media
			],
		},
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
		moderator: '391351349893136394',
		developer: '391351204187340821',
		admin: '391351275805081600',
	},
	features: {
		modLog: {
			channel: '721171219348717679',
			events: ALL_MODLOG_EVENTS,
			prefix: '`[STAFF]`',
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
		moderator: '877575554835030026',
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
			allowSwearing: false,
			minimumChatPermission: PermissionLevel.Everyone,
			overrides: [],
		},
		autoReact: {
			channels: [
				{
					channel: '808144433698570250', // #cfaq-suggestions
					reactions: [':yes:546435721444196353', ':no:546435753719103488'],
					allowMessageAuthorReacting: false,
					allowMultipleUserReactions: false,
				},
			],
		},
		hastebinConversion: {
			ignoredChannels: ['548317804076597249'],
			whitelistedExtensions: HASTEBIN_EXTENSIONS_WHITELIST,
		},
		githubIssue: {
			githubRepoOwner: 'Minehut',
			githubRepoName: 'Meta',
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
