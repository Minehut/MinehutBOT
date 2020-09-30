import { PermissionLevel } from './permission/permissionLevel';

export enum CaseType {
	Kick = 'KICK',
	VoiceKick = 'VOICEKICK',
	Ban = 'BAN',
	Warn = 'WARN',
	Mute = 'MUTE',
	VoiceMute = 'VOICEMUTE',
	UnBan = 'UNBAN',
	UnMute = 'UNMUTE',
	UnVoiceMute = 'UNVOICEMUTE',
	SoftBan = 'SOFTBAN',
	ForceBan = 'FORCEBAN',
}

export const FOREVER_MS = 3.154e13; // This equals 100 decades

export const ONE_HOUR_MS = 3.6e+6;

export const THREE_HOUR_MS = ONE_HOUR_MS * 3;

export const ONE_DAY_MS = ONE_HOUR_MS * 24;

export const ONE_MONTH_MS = ONE_DAY_MS * 30;

export const MESSAGES = {
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
		useHelp: (prefix: string, commandName: string) =>
			`${process.env.EMOJI_AHH} I can help you more if you use \`${prefix}help ${commandName}\``,
	},
};

export const ZALGO_REGEX = new RegExp(
	[
		'\u030d',
		'\u030e',
		'\u0304',
		'\u0305',
		'\u033f',
		'\u0311',
		'\u0306',
		'\u0310',
		'\u0352',
		'\u0357',
		'\u0351',
		'\u0307',
		'\u0308',
		'\u030a',
		'\u0342',
		'\u0343',
		'\u0344',
		'\u034a',
		'\u034b',
		'\u034c',
		'\u0303',
		'\u0302',
		'\u030c',
		'\u0350',
		'\u0300',
		'\u030b',
		'\u030f',
		'\u0312',
		'\u0313',
		'\u0314',
		'\u033d',
		'\u0309',
		'\u0363',
		'\u0364',
		'\u0365',
		'\u0366',
		'\u0367',
		'\u0368',
		'\u0369',
		'\u036a',
		'\u036b',
		'\u036c',
		'\u036d',
		'\u036e',
		'\u036f',
		'\u033e',
		'\u035b',
		'\u0346',
		'\u031a',
		'\u0315',
		'\u031b',
		'\u0340',
		'\u0341',
		'\u0358',
		'\u0321',
		'\u0322',
		'\u0327',
		'\u0328',
		'\u0334',
		'\u0335',
		'\u0336',
		'\u034f',
		'\u035c',
		'\u035d',
		'\u035e',
		'\u035f',
		'\u0360',
		'\u0362',
		'\u0338',
		'\u0337',
		'\u0361',
		'\u0489',
		'\u0316',
		'\u0317',
		'\u0318',
		'\u0319',
		'\u031c',
		'\u031d',
		'\u031e',
		'\u031f',
		'\u0320',
		'\u0324',
		'\u0325',
		'\u0326',
		'\u0329',
		'\u032a',
		'\u032b',
		'\u032c',
		'\u032d',
		'\u032e',
		'\u032f',
		'\u0330',
		'\u0331',
		'\u0332',
		'\u0333',
		'\u0339',
		'\u033a',
		'\u033b',
		'\u033c',
		'\u0345',
		'\u0347',
		'\u0348',
		'\u0349',
		'\u034d',
		'\u034e',
		'\u0353',
		'\u0354',
		'\u0355',
		'\u0356',
		'\u0359',
		'\u035a',
		'\u0323',
	].join('|'),
	'gi'
);

export const IMGUR_LINK_REGEX = /((?:https?:)?\/\/(\w+\.)?imgur\.com\/(\S*)(\.[a-zA-Z]{3}))/im;
