export interface AutoReactChannel {
	channel: string;
	reactions: string[];
}

export interface AutoReactConfiguration {
	channels: AutoReactChannel[];
}
