import { RoleList } from './roleList';
import { ModLogConfiguration } from './features/modLog';
import { ReactionRoleConfiguration } from './features/reactionRole';
import { AnnouncementConfiguration } from './features/announcement';

// The GuildConfiguration can have settings about permissions, log channels, disabled features, etc.
export interface GuildConfiguration {
	id: string;
	roles: RoleList;
	prefix?: string;
	features: {
		modLog?: ModLogConfiguration;
		reactionRole?: ReactionRoleConfiguration;
		announcements?: AnnouncementConfiguration;
	};
}
