import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { BoosterPassModel } from '../../model/boosterPass';

export default class BoosterPassReceiverJoined extends Listener {
	constructor() {
		super('boosterPassReceiverJoined', {
			emitter: 'client',
			event: 'guildMemberAdd',
		});
	}

	async exec(member: GuildMember) {
		const guild = member.guild;
		const config = guildConfigs.get(guild.id);
		if (!config || !config.features.boosterPass) return;
		const boosterPassRole = config.roles.boostersPass;
		if (!boosterPassRole) return;
		const receivedBoosterPasses = await BoosterPassModel.getReceivedByMember(
			member
		);
		if (receivedBoosterPasses.length > 0) member.roles.add(boosterPassRole);
	}
}
