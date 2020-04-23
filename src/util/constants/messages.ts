import { User } from 'discord.js';

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
					start: (author: User) => `${author}, what should the tag be called? (spaces allowed)`,
				},
				contentPrompt: {
					start: (author: User) =>
						`${author}, what should the tag's content be?`,
				},
			},
		},
	},
};
