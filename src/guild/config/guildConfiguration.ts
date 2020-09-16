import { RoleList } from '../roleList';
import { ModLogConfiguration } from './feature/modLog';
import { ReactionRoleConfiguration } from './feature/reactionRole';
import { AnnouncementConfiguration } from './feature/announcement';
import { CensorConfiguration } from './feature/censor';
import CommandConfiguration from './commandConfiguration';

// The GuildConfiguration can have settings about permissions, log channels, disabled features, etc.
export interface GuildConfiguration {
	id: string;
	main?: boolean;
	roles: RoleList;
	prefix?: string;
	commands?: CommandConfiguration;
	features: {
		modLog?: ModLogConfiguration;
		reactionRole?: ReactionRoleConfiguration;
		announcement?: AnnouncementConfiguration;
		censor?: CensorConfiguration;
	};
}
