export interface Announcer {
	role: string;
	channel: string;
	name: string;
}

export interface AnnouncementConfiguration {
	announcers: Announcer[];
}
