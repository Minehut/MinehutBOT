import { PermissionLevel } from "../../../util/permission/permissionLevel";

export interface StarboardConfiguration {
    channel: string;
    triggerAmount: number;
    minimumPermLevel?: PermissionLevel;
    ignoredChannels?: string[];
}