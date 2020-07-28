import { Listener } from 'discord-akairo';
import { DocumentType } from '@typegoose/typegoose';
import { Case } from '../../model/case';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { sendModLogMessage, humanReadableCaseType } from '../../util/functions';
import { CaseType, FOREVER_MS } from '../../util/constants';
import humanizeDuration from 'humanize-duration';

const caseTypeToEmoji = (type: CaseType) => {
	switch (type) {
		case CaseType.Kick:
		case CaseType.VoiceKick:
		case CaseType.SoftBan:
			return ':boot:';

		case CaseType.Ban:
		case CaseType.ForceBan:
			return ':rotating_light:';

		case CaseType.Warn:
			return process.env.EMOJI_WARNING;

		case CaseType.Mute:
		case CaseType.VoiceMute:
			return ':zipper_mouth:';

		case CaseType.UnBan:
		case CaseType.UnMute:
		case CaseType.UnVoiceMute:
			return ':monkey_face:';

		default:
			return ':ok_hand:';
	}
};

export default class ModLogCaseCreateListener extends Listener {
	constructor() {
		super('modLogCaseCreate', {
			emitter: 'client',
			event: 'caseCreate',
		});
	}

	async exec(c: DocumentType<Case>) {
		const config = guildConfigs.get(c.guild);
		if (
			!config ||
			!config.features.modLog ||
			!config.features.modLog.events.includes('caseCreate')
		)
			return;
		const guild = this.client.guilds.cache.get(c.guild);
		if (!guild) return;

		let log;
		if (
			c.moderatorId === this.client.user!.id &&
			c.reason.includes('Automatic un') &&
			[CaseType.UnBan, CaseType.UnMute, CaseType.UnVoiceMute].includes(c.type)
		) {
			// This is an automatic unmute/unban case by the bot
			log = `:clock130: ${c.targetTag} (\`${
				c.targetId
			}\`) was automatically ${humanReadableCaseType(
				c.type,
				false
			)}, their punishment (#${c.id}) expired`;
		} else {
			const duration = c.expiresAt.getTime() - c.createdAt.getTime();
			const humanReadableDuration =
				duration === FOREVER_MS
					? 'permanent'
					: humanizeDuration(duration, { largest: 3, round: true });
			log = `${caseTypeToEmoji(c.type)} ${c.targetTag} (\`${
				c.targetId
			}\`) ${humanReadableCaseType(c.type, false)} by ${c.moderatorTag}${
				c.expiresAt.getTime() !== -1 && humanReadableDuration !== 'permanent'
					? ` for **${humanReadableDuration}** `
					: ' '
			}(\`${c.reason}\`)`;
		}

		await sendModLogMessage(guild, log);
	}
}
