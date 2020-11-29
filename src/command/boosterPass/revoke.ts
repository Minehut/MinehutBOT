import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { Message } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { BoosterPass, BoosterPassModel } from '../../model/boosterPass';
import { DocumentType } from '@typegoose/typegoose';

export default class BoosterPassGiveCommand extends MinehutCommand {
	constructor() {
		super('boosterpass-revoke', {
			permissionLevel: PermissionLevel.NitroBooster,
			// Only nitro boosters can revoke booster passes
			enforcePermissionLevelRole: true,
			category: 'boosterpass',
			channel: 'guild',
			description: {
				content:
					'Remove a booster pass from a member, if you have given them one',
				usage: '<member>',
				examples: [
					'boosterpass revoke @Facto',
					'boosterpass revoke 535986058991501323',
				],
			},
			clientPermissions: ['MANAGE_ROLES'],
			args: [
				{
					id: 'boosterPassReceived',
					type: 'boosterPassReceived',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, whose booster pass do you want to revoke?`,
						retry: (msg: Message) =>
							`${msg.author}, please mention a member you have given a booster pass to (if the member has left, supply their ID).`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{ boosterPassReceived }: { boosterPassReceived: DocumentType<BoosterPass> }
	) {
		const config = guildConfigs.get(msg.guild!.id);
		const boosterPassConfig = config?.features.boosterPass;
		const nitroBoosterRole = config?.roles.nitroBooster;
		const boosterPassRole = config?.roles.boostersPass;

		if (!boosterPassConfig)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} Booster passes not enabled in configuration!`
			);

		if (!nitroBoosterRole || !boosterPassRole)
			throw new Error('Booster pass roles not configured in guild config');

		const boosterPasses = await BoosterPassModel.getGrantedByMember(
			msg.member!
		);

		await boosterPassReceived.remove();

		await msg
			.guild!.members.fetch(boosterPassReceived.grantedId)
			.then(async member => {
				const memberGrantedBoosterPasses = await BoosterPassModel.getReceivedByMember(
					member
				);
				if (memberGrantedBoosterPasses.length <= 0)
					await member.roles.remove(boosterPassRole);
			})
			.catch(() => {});

		const maximumBoosterPasses =
			boosterPassConfig.maximumGrantedBoosterPasses || 2;

		this.client.emit('boosterPassRevoke', msg.member!, boosterPassReceived);
		return msg.channel.send(
			`${process.env.EMOJI_CHECK} removed a booster pass from **${
				boosterPassReceived.grantedTag
			}** (${maximumBoosterPasses - (boosterPasses.length - 1)} left)`
		);
	}
}
