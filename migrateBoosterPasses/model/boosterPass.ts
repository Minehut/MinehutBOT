import { getModelForClass, prop } from '@typegoose/typegoose';

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
}

export const BoosterPassModel = getModelForClass(BoosterPass, {
	schemaOptions: { timestamps: true },
});
