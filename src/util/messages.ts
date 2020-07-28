import { PermissionLevel } from './permission/permissionLevel';

export const messages = {
	commandHandler: {
		prompt: {
			modifyStart: (str: string) =>
				`${str}\n\nType \`cancel\` to cancel the command.`,
			modifyRetry: (str: string) =>
				`${str}\n\nType \`cancel\` to cancel the command.`,
			timeout: 'You took too long so the command has been cancelled.',
			ended: 'Be prepared next time. The command has been cancelled.',
			cancel: 'The command has been cancelled.',
		},
	},
	events: {
		commandHandler: {
			missingPermissions: {
				user: (required: PermissionLevel) =>
					`:no_entry: you don't have the required permission level (${required})`,
				client: (missing: string) =>
					`${process.env.EMOJI_CROSS} bot is missing permission ${missing}`,
			},
		},
	},
	commands: {
		common: {
			useHelp: (prefix: string, commandName: string) =>
				`${process.env.EMOJI_AHH} I can help you more if you use \`${prefix}help ${commandName}\``,
		},
	},
};
