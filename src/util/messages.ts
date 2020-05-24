import { User } from 'discord.js';
import { PermissionLevel } from './permission/permissionLevel';
import { GuildMember } from 'discord.js';

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
			warn: (error: string) => `${emoji.warning} ${error}`,
		},
		punishment: {
			kick: {
				description: 'Kick a member',
				memberPrompt: {
					start: (author: User) => `${author}, who do you want to kick?`,
					retry: (author: User) => `${author}, please mention a member.`,
				},
				notKickable: `${emoji.cross} I cannot kick that member`,
				kicked: (target: GuildMember, reason: string) =>
					`:boot: kicked ${target.user.tag} (\`${reason}\`)`,
			},
			warn: {
				description: 'Warn a member',
				memberPrompt: {
					start: (author: User) => `${author}, who do you want to warn?`,
					retry: (author: User) => `${author}, please mention a member.`,
				},
				reasonPrompt: {
					start: (author: User) =>
						`${author}, what is the reason for the warning?`,
					retry: (author: User) => `${author}, please include a reason.`,
				},
				warned: (target: GuildMember, reason: string) =>
					`${emoji.warning} warned ${target.user.tag} for \`${reason}\``,
			},
		},
		case: {
			description: 'Manage cases (todo: add methods)',
			search: {
				description: `Lookup cases where specific user is target`,
				loading: (target: string) =>
					`${emoji.loading} Searching for cases where target is **${target}**`,
				targetPrompt: {
					start: (author: User) => `${author}, who do you want to lookup?`,
					retry: (author: User) => `${author}, please mention a user.`,
				},
				emptyHistory: `${emoji.dab} No cases found for this user`,
			},
			reason: {
				description: `Set a case reason`,
				casePrompt: {
					start: (author: User) =>
						`${author}, which case's reason do you want to change?`,
					retry: (author: User) => `${author}, please specify a valid case ID.`,
				},
				reasonPrompt: {
					start: (author: User) =>
						`${author}, what do you want the case reason to be?`,
					retry: (author: User) => `${author}, please specify a case reason.`,
				},
				caseUpdated: (id: number, reason: string) =>
					`${emoji.check} updated reason for case **${id}** (\`${reason}\`)`,
			},
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
				description: 'Set/edit a tag',
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
				description: 'Show specific tag',
				namePrompt: {
					start: (author: User) => `${author}, which tag do you want to show?`,
				},
				unknownTag: (prefix: string, name: string) =>
					`${emoji.cross} tag \`${name}\` does not exist, check \`${prefix}tags\``,
				showTag: (content: string) => content,
			},
			delete: {
				description: 'Delete a tag',
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
				description: 'Lookup a tag',
				namePrompt: {
					start: (author: User) =>
						`${author}, which tag do you want to lookup?`,
				},
				unknownTag: (prefix: string, name: string) =>
					`${emoji.cross} tag \`${name}\` does not exist, check \`${prefix}tags\``,
			},
			rename: {
				description: 'Rename a tag',
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
			list: {
				description: 'List the tags',
			},
			aliases: {
				set: {
					description: 'Set a tag alias',
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
					description: 'Delete a tag alias',
					aliasIsName: (alias: string) =>
						`${emoji.cross} \`${alias}\` is a name, not an alias`,
					unknownAlias: (alias: string) =>
						`${emoji.cross} unknown alias \`${alias}\``,
					deletedAlias: (alias: string) =>
						`${emoji.check} deleted alias \`${alias}\``,
				},
				list: {
					description: 'List all tag aliases',
				},
			},
		},
	},
};
