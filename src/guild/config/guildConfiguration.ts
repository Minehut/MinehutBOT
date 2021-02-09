import { RoleList } from '../roleList';
import { ModLogConfiguration } from './feature/modLog';
import { ReactionRoleConfiguration } from './feature/reactionRole';
import { AnnouncementConfiguration } from './feature/announcement';
import { CensorConfiguration } from './feature/censor';
import { AutoReactConfiguration } from './feature/autoReact';
import { BoosterPassConfiguration } from './feature/boosterPass';
import { HastebinConversionConfiguration } from './feature/hastbinConversion';
import { GithubIssueReferenceConfiguration } from './feature/githubIssue';
<<<<<<< HEAD
import { StarboardConfiguration } from './feature/starboard';
=======
import { ChannelLockdownConfiguration } from './feature/channelLockdown';
>>>>>>> 8f4c45f (lockdown command)

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
		boosterPass?: BoosterPassConfiguration;
		hastebinConversion?: HastebinConversionConfiguration;
		githubIssue?: GithubIssueReferenceConfiguration;
		starboard?: StarboardConfiguration;
		channelLockdown?: ChannelLockdownConfiguration;
	};
}
