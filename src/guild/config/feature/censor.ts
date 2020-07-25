import { PermissionLevel } from '../../../util/permission/permissionLevel';

export interface CensorConfiguration {
	// ignoredChannels?: string[];
	// ignoredCategories?: string[];
	overrides: {
		type: 'channel' | 'category';
		id: string;
		config: Omit<CensorConfiguration, 'overrides'>;
	}[];

	allowZalgo?: boolean;
	allowCopyPasta?: boolean;
	allowSwearing?: boolean;
	allowInvites?: boolean;
	allowSpam?: boolean;

	inviteWhitelist?: string[];
	minimumChatPermission?: PermissionLevel;
	minimumBypassPermission?: PermissionLevel;
}
