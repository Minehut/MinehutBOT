export const messages = {
	commands: {
		ping: {
			description: 'Ping, pong',
			responseLoading: ':ping_pong: Ping?',
			responseFinished: (roundtrip: Number, wsPing: Number) =>
				`:ping_pong: Pong! (Roundtrip: ${
					roundtrip
				}ms | One-way: ${wsPing}ms)`,
		},
	},
};
