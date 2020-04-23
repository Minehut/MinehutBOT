import { User } from 'discord.js';

export const emoji = {
	cross: '<:jcross:548390154381950976>',
	check: '<:jcheck:548390154294001674>'
};

export const messages = {
	commands: {
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
				tagUpdated: (name: string) => `${emoji.check} tag \`${name}\` updated`
			},
		},
	},
};
