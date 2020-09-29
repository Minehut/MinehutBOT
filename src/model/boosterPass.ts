import { getModelForClass, prop } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { GuildMember } from 'discord.js';
import { guildConfigs } from '../guild/config/guildConfigs';

export class BoosterPass {
	@prop({ required: true })
	granterId!: string;

	@prop({ required: true })
	granterTag!: string;

	@prop({ required: true })
	grantedId!: string;

	@prop({ required: true })
	grantedTag!: string;

	@prop({ required: true })
	guild!: string;

	// These are automatically filled by Mongoose, they are just here for typings
	@prop({ required: false })
	createdAt?: Date;

	@prop({ required: false })
	updatedAt?: Date;

	static async getGrantedByMember(
		this: ModelType<BoosterPass>,
		member: GuildMember,
		limit?: number
	) {
		const query = this.find({
			granterId: member.id,
			guild: member.guild.id,
		});
		if (limit) query.limit(limit);
		return query;
	}

	static async getReceivedByMember(
		this: ModelType<BoosterPass>,
		member: GuildMember,
		limit?: number
	) {
		const query = this.find({
			grantedId: member.id,
			guild: member.guild.id,
		});
		if (limit) query.limit(limit);
		return query;
	}

	static async removeAllGrantedByMember(
		this: ModelType<BoosterPass>,
		member: GuildMember
	) {
		const boosterPasses = await BoosterPassModel.getGrantedByMember(member);
		if (boosterPasses.length > 0)
			boosterPasses.forEach(async bp => {
				await bp.remove();
				const boosterPassRole = guildConfigs.get(member.guild.id)?.roles
					.boostersPass;
				if (!boosterPassRole)
					throw new Error(
						`Guild ${member.guild.id} does not have a configured booster pass role!`
					);
				const boosterPassReceiver = await member.guild.members.fetch(
					bp.grantedId
				);
				if (!boosterPassReceiver) return;
				const receiverReceivedPasses = await BoosterPassModel.getReceivedByMember(
					boosterPassReceiver
				);
				if (
					receiverReceivedPasses.length < 0 &&
					boosterPassReceiver.roles.cache.has(boosterPassRole)
				)
					boosterPassReceiver.roles.remove(boosterPassRole);
			});
	}
}

export const BoosterPassModel = getModelForClass(BoosterPass, {
	schemaOptions: { timestamps: true },
});
