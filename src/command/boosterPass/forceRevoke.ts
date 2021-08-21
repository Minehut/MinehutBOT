import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { Message } from 'discord.js';
import { GuildMember } from 'discord.js';
import { User } from 'discord.js';
import { BoosterPassModel } from '../../model/boosterPass';
import { guildConfigs } from '../../guild/config/guildConfigs';

export default class BoosterPassForceRevokeCommand extends MinehutCommand {
	constructor() {
		super('boosterpass-force-revoke', {
			permissionLevel: PermissionLevel.Moderator,
			category: 'boosterpass',
			channel: 'guild',
			description: {
				content:
					'Forcefully revoke a booster pass that someone has granted',
				usage: '<member> <user>',
				examples: [
					'boosterpass force-revoke @Facto @RichieNy',
					'boosterpass force-revoke 535986058991501323 361294035077431308',
				],
			},
			clientPermissions: ['MANAGE_ROLES'],
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, from whose granted booster passes do you want me to revoke?`,
						retry: (msg: Message) =>
							`${msg.author}, please mention a valid member.`,
					},
				},
				{
					id: 'boosterPassReceiver',
					type: 'user',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, whose booster pass would you like to revoke?`,
						retry: (msg: Message) =>
							`${msg.author}, please mention a valid user.`,
					},
				},
			],
		});
	}

	async exec(
		msg: Message,
		{
			member,
			boosterPassReceiver,
		}: { member: GuildMember; boosterPassReceiver: User }
	) {
		const guildConfig = guildConfigs.get(msg.guild!.id);
		const boosterPassConfig = guildConfig?.features.boosterPass;
		const boosterPassRole = guildConfig?.roles.boostersPass;

		if (!boosterPassConfig)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} Booster passes not enabled in configuration!`
			);

		if (!boosterPassRole)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} Booster pass role is not configured!`
			);

		const grantedBoosterPasses = await BoosterPassModel.getGrantedByMember(
			member
		);
		const receivedBoosterPass = grantedBoosterPasses.find(
			bp => bp.grantedId === boosterPassReceiver.id
		);

		if (!receivedBoosterPass)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} This user hasn't received any booster passes from the mentioned member!`
			);

		await receivedBoosterPass.remove();

		await msg
			.guild!.members.fetch(boosterPassReceiver.id)
			.then(async boosterPassReceiverMember => {
				const memberGrantedBoosterPasses = await BoosterPassModel.getReceivedByMember(
					boosterPassReceiverMember
				);
				if (memberGrantedBoosterPasses.length <= 0)
					await boosterPassReceiverMember.roles.remove(boosterPassRole);
			})
			.catch(() => {});

		this.client.emit('boosterPassRevoke', msg.member!, receivedBoosterPass);
		return msg.channel.send(
			`${process.env.EMOJI_CHECK} forcefully removed a booster pass from **${receivedBoosterPass.grantedTag}**`
		);
	}
}
