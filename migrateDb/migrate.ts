/*
	THIS IS ONE OF THE WORST FILES I'VE EVER WRITTEN
*/

import { mongoose } from '@typegoose/typegoose';
import { TagModel, Tag } from './model/tag';
import { CaseModel, Case } from './model/case';

const r = require('rethinkdbdash')({ db: 'minehut' });

const FOREVER_MS = 3.154e13; // This equals 100 decades

export enum CaseType {
	Kick = 'KICK',
	VoiceKick = 'VOICEKICK',
	Ban = 'BAN',
	Warn = 'WARN',
	Mute = 'MUTE',
	VoiceMute = 'VOICEMUTE',
	UnBan = 'UNBAN',
	UnMute = 'UNMUTE',
	UnVoiceMute = 'UNVOICEMUTE',
	SoftBan = 'SOFTBAN',
	ForceBan = 'FORCEBAN',
}

console.log(process.env.MONGO_URI);

(async () => {
	const connection = await mongoose.connect(process.env.MONGO_URI || '', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	const rtags = await r.table('tags').run();
	// console.log(rtags);

	rtags.forEach((rtr: any) => {
		TagModel.create({
			name: rtr.id,
			content: rtr.content,
			author: '250536623270264833',
			guild: '239599059415859200',
			aliases: rtr.aliases,
			uses: rtr.uses,
		} as Tag);
		console.log(`Inserted ${rtr.id} into Mongo`);
	});

	const rpunishments = await r.table('punishments').run();
	// console.log(rpunishments);

	rpunishments.forEach((rtp: any) => {
		let type: CaseType;
		switch (rtp.type) {
			case 'MUTE':
				type = CaseType.Mute;
				break;
			case 'BAN':
				type = CaseType.Ban;
				break;
			case 'WARN':
				type = CaseType.Warn;
				break;
			default:
				type = CaseType.Kick;
				break;
		}
		const expiresAt =
			rtp.dateExpired === undefined
				? type === CaseType.Ban || type === CaseType.Mute
					? new Date(new Date(rtp.date).getTime() + FOREVER_MS)
					: new Date(-1)
				: new Date(rtp.dateExpired);
		CaseModel.create({
			active: rtp.active,
			moderatorId: rtp.moderator.id,
			moderatorTag: rtp.moderator.name,
			targetId: rtp.punished.id,
			targetTag: rtp.punished.name,
			createdAt: new Date(rtp.date),
			_id: rtp.id,
			reason: rtp.reason,
			type,
			guild: '239599059415859200',
			expiresAt,
		} as Case);
		console.log(`Inserted case ${rtp.id} into Mongo`);
	});
})();
