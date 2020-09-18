import { getModelForClass, prop } from "@typegoose/typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { GuildMember } from "discord.js";

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
	createdAt!: Date;

	@prop({ required: false })
    updatedAt!: Date;
    
    static async getBoosterPasses(this: ModelType<BoosterPass>, member: GuildMember, limit?: number) {
        const query = this.find({
            granterId: member.id,
            guild: member.guild.id
        });
        if (limit) 
            query.limit(limit);
        return query;
    }

    static async getGrantedBoosterPasses(this: ModelType<BoosterPass>, member: GuildMember, limit?: number) {
        const query = this.find({
            grantedId: member.id,
            guild: member.guild.id
        });
        if (limit)
            query.limit(limit);
        return query;
    }

}

export const BoosterPassModel = getModelForClass(BoosterPass, {
    schemaOptions: { timestamps: true }
});