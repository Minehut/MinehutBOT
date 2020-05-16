import { User } from 'discord.js';
import { PermissionLevel } from './permission/permissionLevel';

export const emoji = {
	cross: '<:mhcross:548390154381950976>',
	check: '<:mhdottick:610799592589623306>',
	warning: '<:mhdotwarning:610801144914247690>',
	ahh: '<:mhnotthis:703852468756283395>',
};

export const messages = {
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
			warn: (error: string) => `${emoji.warning} ${error}`,
		},
		utility: {
			eval: {
				outputTooLong: (length: number) =>
					`${emoji.warning} length of output exceeds character limit, logged output to console (${length}/2000)`,
			},
			ping: {
				description: 'Ping, pong',
				responseLoading: ':ping_pong: Ping?',
				responseFinished: (roundtrip: Number, wsPing: Number) =>
					`:ping_pong: Pong! (Roundtrip: ${roundtrip}ms | One-way: ${wsPing}ms)`,
			},
			myLevel: {
				description: 'Show your permission level',
				response: (permLevel: Number, permLevelName: string) =>
					`Your permission level is ${permLevel} (${permLevelName})`,
			},
		},
		tag: {
			set: {
				namePrompt: {
					start: (author: User) =>
						`${author}, what should the tag be called? (spaces allowed)`,
				},
				contentPrompt: {
					start: (author: User) =>
						`${author}, what should the tag's content be?`,
				},
				conflictingAliases: (prefix: string, conflictingTag: string) =>
					`${emoji.cross} tag name conflicts with \`${conflictingTag}\`'s aliases (use ${prefix}tag info ${conflictingTag})`,
				tagCreated: (name: string) => `${emoji.check} tag \`${name}\` created`,
				tagUpdated: (name: string) => `${emoji.check} tag \`${name}\` updated`,
			},
			show: {
				namePrompt: {
					start: (author: User) => `${author}, which tag do you want to show?`,
				},
				unknownTag: (prefix: string, name: string) =>
					`${emoji.cross} tag \`${name}\` does not exist, check \`${prefix}tags\``,
				showTag: (content: string) => content,
			},
			delete: {
				unknownTag: (prefix: string, name: string) =>
					`${emoji.cross} tag \`${name}\` does not exist, check \`${prefix}tags\``,
				namePrompt: {
					start: (author: User) =>
						`${author}, which tag do you want to delete?`,
				},
				tagDeleted: (name: string, aliases: string[]) =>
					`:wastebasket: tag \`${name}\` deleted ${
						aliases.length > 0 ? `(aliases: ${aliases.join(', ')})` : ''
					}`,
				useNameNotAlias: (prefix: string, alias: string, name: string) =>
					`${emoji.cross} \`${alias}\` is an alias of \`${name}\` -- you can delete the alias with \`${prefix}tag deletealias ${alias}\`, or delete the entire tag with \`${prefix}tag delete ${name}\``,
			},
			info: {
				namePrompt: {
					start: (author: User) =>
						`${author}, which tag do you want to lookup?`,
				},
				unknownTag: (prefix: string, name: string) =>
					`${emoji.cross} tag \`${name}\` does not exist, check \`${prefix}tags\``,
			},
			rename: {
				oldNamePrompt: {
					start: (author: User) =>
						`${author}, which tag do you want to rename?`,
				},
				newNamePrompt: {
					start: (author: User) =>
						`${author}, what should the tag's new name be?`,
				},
				conflictingName: `${emoji.cross} a tag with the new name/alias already exists`,
				tagUpdated: (old: string, newName: string) =>
					`${emoji.check} tag \`${old}\` is now \`${newName}\``,
				unknownTag: (prefix: string, name: string) =>
					`${emoji.cross} tag \`${name}\` does not exist, check \`${prefix}tags\``,
			},
			aliases: {
				set: {
					aliasPrompt: {
						start: (author: User) =>
							`${author}, what do you want the alias to be?`,
					},
					namePrompt: {
						start: (author: User) =>
							`${author}, which tag do you want this alias to be added to?`,
					},
					nothingChanged: ':o: nothing changed',
					unknownTarget: (name: string) =>
						`${emoji.cross} unknown target \`${name}\``,
					aliasesUpdated: (target: string, newAlias: string, all: string[]) =>
						`${
							emoji.check
						} \`${newAlias}\` now points to \`${target}\` (aliases: ${all.join(
							', '
						)})`,
				},
				delete: {
					aliasIsName: (alias: string) =>
						`${emoji.cross} \`${alias}\` is a name, not an alias`,
					unknownAlias: (alias: string) =>
						`${emoji.cross} unknown alias \`${alias}\``,
					deletedAlias: (alias: string) =>
						`${emoji.check} deleted alias \`${alias}\``,
				},
			},
		},
	},
};
