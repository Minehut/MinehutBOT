import { RoleList } from '../roleList';
import { ModLogConfiguration } from './feature/modLog';
import { ReactionRoleConfiguration } from './feature/reactionRole';
import { AnnouncementConfiguration } from './feature/announcement';
import { CensorConfiguration } from './feature/censor';
import { StarboardConfiguration } from './feature/starboard';
import { AutoReactConfiguration } from './feature/autoReact';
import { BoosterPassConfiguration } from './feature/boosterPass';
import { HastebinConversionConfiguration } from './feature/hastbinConversion';
import { GithubIssueReferenceConfiguration } from './feature/githubIssue';

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
		starboard?: StarboardConfiguration;
		autoReact?: AutoReactConfiguration;
		boosterPass?: BoosterPassConfiguration;
		hastebinConversion?: HastebinConversionConfiguration;
		githubIssue?: GithubIssueReferenceConfiguration;
	};
}
