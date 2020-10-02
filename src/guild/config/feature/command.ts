export interface BlockedChannelConfiguration {
	channel: string;
	whitelistedCommandCategories?: string[];
}

export interface CommandConfiguration {
	blockedChannels?: BlockedChannelConfiguration[];
}