import { prop, getModelForClass } from '@typegoose/typegoose';
import { CaseType } from '../util/constants';

export class Case {
	@prop({ required: true })
	_id!: number;

	@prop({ required: true })
	active!: boolean;

	@prop({ required: true })
	moderatorId!: string;

	@prop({ required: true })
	moderatorTag!: string;

	@prop({ required: true })
	targetId!: string;

	@prop({ required: true })
	targetTag!: string;

	@prop({ required: true })
	expiresAt!: Date;

	@prop({ required: true })
	reason!: string;

	@prop({ required: true, enum: CaseType })
	type!: CaseType;

	// These are automatically filled by Mongoose, they are just here for typings
	@prop({ required: false })
	createdAt!: Date;

	@prop({ required: false })
	updatedAt!: Date;
}

export const CaseModel = getModelForClass(Case, {
	schemaOptions: { timestamps: true },
});
