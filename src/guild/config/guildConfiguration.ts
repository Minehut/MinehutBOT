import { RoleList } from '../roleList';
import { ModLogConfiguration } from './feature/modLog';
import { ReactionRoleConfiguration } from './feature/reactionRole';
import { AnnouncementConfiguration } from './feature/announcement';
import { CensorConfiguration } from './feature/censor';
import { AutoReactConfiguration } from './feature/autoReact';
import { HastebinConversionConfiguration } from './feature/hastbinConversion';

// The GuildConfiguration can have settings about permissions, log channels, disabled features, etc.
export interface GuildConfiguration {
	id: string;
	main?: boolean;
	roles: RoleList;
	prefix?: string;
	features: {
		modLog?: ModLogConfiguration;
		reactionRole?: ReactionRoleConfiguration;
		announcement?: AnnouncementConfiguration;
		censor?: CensorConfiguration;
		autoReact?: AutoReactConfiguration;
		hastebinConversion?: HastebinConversionConfiguration;
	};
}
