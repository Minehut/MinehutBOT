import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { BoosterPassModel } from '../../model/boosterPass';

export default class BoosterPassNitroBoosterLeft extends Listener {
	constructor() {
		super('boosterPassNitroBoosterLeft', {
			emitter: 'client',
			event: 'guildMemberRemove',
		});
	}

	async exec(member: GuildMember) {
		const config = guildConfigs.get(member.guild.id);
		if (!config || !config.features.boosterPass) return;
		await BoosterPassModel.removeAllGrantedByMember(member);
	}
}
