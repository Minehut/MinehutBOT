import { GuildConfiguration } from './guildConfiguration';
import {
	ALL_MODLOG_EVENTS,
	INVITE_WHITELIST,
} from './common';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export const guildConfigs: Map<string, GuildConfiguration> = new Map();

// Main Minehut discord
guildConfigs.set('813549431672406028', {
	id: '813549431672406028',
	main: true,
	roles: {
		muted: '830403447555751947',
		nitroBooster: '823993929086140426',
		moderator: '246487117000212480',
		manager: '829482982527074364', // admin role, wasn't bothered to change different roles
		admin: '814523148316835920', // owner role
	},
	features: {
		censor: {
			inviteWhitelist: INVITE_WHITELIST,
			allowSwearing: true,
			minimumChatPermission: PermissionLevel.Everyone,
			overrides: [],
		},
		modLog: {
			channel: '814873443357950042',
			events: ALL_MODLOG_EVENTS,
			prefix: '',
		},
		reactionRole: {
			channel: '815671552741605376',
			roles: [
				{ roleId: '831860597091729439', emoji: '📰' }, // changelog
				{ roleId: '831860539507474453', emoji: '🧑‍🤝‍🧑' }, // announcements
			],
		},
		channelLockdown: {
			allFlagChannels: [
				'814904671293538335', // #main-chat
				'814904704215285800', // #off-topic
				'814904744883388416', // #suggestions
				'814904775069138954', // #suggestions-discussion
				'814904807919583272', // #memes
			],
			reactionPermissionIgnoredChannels: [
				'814904744883388416', // #suggestions
			],
		},
		autoReact: {
			channels: [
				{
					channel: '814904744883388416', // #suggestions
					reactions: [':yestick:831849782283862027', ':nocross:831849753862996000'],
					allowMessageAuthorReacting: false,
					allowMultipleUserReactions: false,
				},
		]},
	}
});
