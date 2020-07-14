import { PermissionLevel } from '../../../util/permission/permissionLevel';

export interface CensorConfiguration {
	ignoredChannels?: string[];
	ignoredCategories?: string[];

	allowZalgo?: boolean;
	allowCopyPasta?: boolean;
	allowSwearing?: boolean;
	allowInvites?: boolean;

	inviteWhitelist?: string[];
	minimumBypassPermission: PermissionLevel;
}
