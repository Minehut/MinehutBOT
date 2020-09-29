import { RoleList } from '../roleList';
import { ModLogConfiguration } from './feature/modLog';
import { ReactionRoleConfiguration } from './feature/reactionRole';
import { AnnouncementConfiguration } from './feature/announcement';
import { CensorConfiguration } from './feature/censor';
import { BoosterPassConfiguration } from './feature/boosterPass';
import { CommandConfiguration } from './feature/command';

// The GuildConfiguration can have settings about permissions, log channels, disabled features, etc.
export interface GuildConfiguration {
	id: string;
	main?: boolean;
	roles: RoleList;
	prefix?: string;
	features: {
		commands?: CommandConfiguration;
		modLog?: ModLogConfiguration;
		reactionRole?: ReactionRoleConfiguration;
		announcement?: AnnouncementConfiguration;
		censor?: CensorConfiguration;
		boosterPass?: BoosterPassConfiguration;
	};
}
