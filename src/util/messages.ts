import { PermissionLevel } from './permission/permissionLevel';

export const emoji = {
	cross: '<:mhcross:548390154381950976>',
	check: '<:mhdottick:610799592589623306>',
	warning: '<:mhdotwarning:610801144914247690>',
	ahh: '<:mhnotthis:703852468756283395>',
	loading: '<a:dotloading:610799582812700673>',
	dab: '<:mhdab:713449873776574505>',
	active: '<:jonline:548390154956570645>',
	inactive: '<:jdnd:548390154319036439>',
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
					`:no_entry: you don't have the required permission level (${required.toString()})`,
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
