import { prop, getModelForClass } from '@typegoose/typegoose';

export class Star {
	@prop({ required: true })
	_id!: string;

	@prop({required: true})
	author!: string;

	@prop({ required: true })
	guild!: string;

	@prop({required: true})
	starAmount!: number;

	// These are automatically filled by Mongoose, they are just here for typings
	@prop({ required: false })
	createdAt!: Date;

	@prop({ required: false })
	updatedAt!: Date;
}

export const StarModel = getModelForClass(Star, {
	schemaOptions: { timestamps: true },
});
