export interface AutoReactChannel {
	channel: string;
	reactions: string[];
	allowMessageAuthorReacting: boolean;
	allowMultipleUserReactions: boolean;
}

export interface AutoReactConfiguration {
	channels: AutoReactChannel[];
}
