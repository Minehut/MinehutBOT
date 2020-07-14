import { PermissionLevel } from './permission/permissionLevel';

export const emoji = {
	cross: '<:botcross:732545645726138388>',
	check: '<:botcheck:732545645797441636>',
	warning: '<:botwarning:732545645625344040>',
	ahh: '<:botahh:732545645881327616>',
	loading: '<a:botloading:732545648406036562>',
	dab: '<:botdab:732545639551860756>',
	active: '<:botonline:732545637572411443>',
	inactive: '<:botdnd:732545635894558751>',
};

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
					`${emoji.cross} bot is missing permission ${missing}`,
			},
		},
	},
	commands: {
		common: {
			useHelp: (prefix: string, commandName: string) =>
				`${emoji.ahh} I can help you more if you use \`${prefix}help ${commandName}\``,
		},
	},
};
