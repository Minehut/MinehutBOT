import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { BoosterPassModel } from '../../model/boosterPass';

export default class BoosterPassUserLeft extends Listener {
	constructor() {
		super('boosterPassUserLeft', {
			emitter: 'client',
			event: 'guildMemberRemove',
		});
	}

	async exec(member: GuildMember) {
		const receivedBoosterPasses = await BoosterPassModel.getReceivedByMember(
			member
		);

		if (receivedBoosterPasses.length > 0)
			receivedBoosterPasses.forEach(bp => bp.remove());
	}
}
