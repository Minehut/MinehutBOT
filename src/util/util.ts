import { CaseType } from './constants';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);
export const ago = new TimeAgo('en-US');

// todo: Maybe move this to a base Action class? OOP FTW
export function humanReadableCaseType(
	type: CaseType,
	startUppercase: boolean = true
) {
	let readable;
	switch (type) {
		case CaseType.Ban:
			readable = 'banned';
			break;
		case CaseType.ForceBan:
			readable = 'forcebanned';
			break;
		case CaseType.Kick:
			readable = 'kicked';
			break;
		case CaseType.Mute:
			readable = 'muted';
			break;
		case CaseType.SoftBan:
			readable = 'softbanned';
			break;
		case CaseType.UnMute:
			readable = 'unmuted';
			break;
		case CaseType.UnVoiceMute:
			readable = 'unvoicemuted';
			break;
		case CaseType.Unban:
			readable = 'unbanned';
			break;
		case CaseType.VoiceKick:
			readable = 'voicekicked';
			break;
		case CaseType.VoiceMute:
			readable = 'voicemuted';
			break;
		case CaseType.Warn:
			readable = 'warned';
			break;
		default:
			readable = 'punished';
	}
	return startUppercase
		? readable.charAt(0).toUpperCase() + readable.slice(1)
		: readable;
}
