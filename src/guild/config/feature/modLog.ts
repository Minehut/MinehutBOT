// type modLogEvents =
// 	| 'memberJoin'
// 	| 'memberLeave'
// 	| 'memberUserNameUpdate'
// 	| 'memberNickNameUpdate'
// 	| 'messageDelete'
// 	| 'messageEdit'
// 	| 'messageCensor'
// 	| 'caseCreate'
// 	| 'caseDelete'
// 	| 'caseReasonUpdate'
// 	| 'caseDurationUpdate'
// 	| 'memberRolesUpdate'
// 	| 'command';

export interface ModLogConfiguration {
	channel: string;
	prefix: string;
	events: string[];
	ignoredChannels?: string[];
}
