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
	},
};
