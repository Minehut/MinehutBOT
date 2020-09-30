import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { Message } from 'discord.js';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { BoosterPassModel } from '../../model/boosterPass';

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
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, whose booster pass do you want to revoke?`,
						retry: (msg: Message) => `${msg.author}, please mention a member.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { member }: { member: GuildMember }) {
		const boosterPassConfiguration = guildConfigs.get(msg.guild!.id)?.features
			.boosterPass;

		const nitroBoosterRole = guildConfigs.get(msg.guild!.id)?.roles
			.nitroBooster;
		const boosterPassRole = guildConfigs.get(msg.guild!.id)?.roles.boostersPass;

		if (!boosterPassConfiguration)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} Booster passes not enabled in configuration!`
			);

		if (!nitroBoosterRole || !boosterPassRole)
			throw new Error('Booster pass roles not configured in guild config');

		const boosterPasses = await BoosterPassModel.getGrantedByMember(
			msg.member!
		);

		const boosterPass = boosterPasses.find(b => b.grantedId === member.id);

		if (!boosterPass)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} You haven't given this user a booster pass!`
			);

		await boosterPass.remove();

		const memberGrantedBoosterPasses = await BoosterPassModel.getReceivedByMember(
			member
		);

		const maximumBoosterPasses =
			boosterPassConfiguration.maximumGrantedBoosterPasses || 2;

		if (memberGrantedBoosterPasses.length <= 0)
			await member.roles.remove(boosterPassRole);
		return msg.channel.send(
			`${process.env.EMOJI_CHECK} removed a booster pass from **${
				member.user.tag
			}** (${maximumBoosterPasses - (boosterPasses.length - 1)} left)`
		);
	}
}
