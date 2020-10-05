import { PermissionLevel } from "../../../util/permission/permissionLevel";

export interface StarboardConfiguration {
    channel: string;
    triggerAmount: number;
    emoji?: string;
    minimumPermLevel?: PermissionLevel;
    ignoredChannels?: string[];
}