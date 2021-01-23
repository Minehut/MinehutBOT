import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { MinehutCommandOptions } from './minehutCommandOptions';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { hasPermissionLevelRole } from '../../util/permission/hasPermissionLevelRole';

export class MinehutCommand extends Command {
	permissionLevel: PermissionLevel;

	constructor(id: string, options?: MinehutCommandOptions) {
		super(id, options);

		this.permissionLevel = options?.permissionLevel || PermissionLevel.Everyone;

		this.userPermissions = (msg: Message) => {
			if (msg.member) {
				if (getPermissionLevel(msg.member!, this.client) < this.permissionLevel)
					return this.permissionLevel;
				if (
					options?.enforcePermissionLevelRole &&
					!hasPermissionLevelRole(this.permissionLevel, msg.member)
				)
					return this.permissionLevel;
				return null;
			}

			return null;
		};
	}
}
