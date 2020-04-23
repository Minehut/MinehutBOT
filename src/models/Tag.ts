import { prop, getModelForClass } from '@typegoose/typegoose';

export class Tag {
	@prop({ required: true })
	name!: string;

	@prop({ required: true })
	content!: string;

	@prop({ default: [] })
	aliases?: string[]
}

export const TagModel = getModelForClass(Tag);