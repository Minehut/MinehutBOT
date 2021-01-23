import { prop, getModelForClass } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

export class Tag {
	@prop({ required: true })
	section!: string;

	@prop({ required: true })
	name!: string;

	@prop({ required: true })
	content!: string;

	@prop({ required: true })
	author!: string;

	@prop({ required: true })
	guild!: string;

	@prop({ default: [] })
	aliases!: string[];

	@prop({ default: 0 })
	uses!: number;

	// These are automatically filled by Mongoose, they are just here for typings
	@prop({ required: false })
	createdAt!: Date;

	@prop({ required: false })
	updatedAt!: Date;

	static async findByNameOrAlias(this: ModelType<Tag>, name: string) {
		return this.findOne({
			$or: [{ name }, { aliases: { $in: [name] } }],
		});
	}

	static async findByAlias(this: ModelType<Tag>, name: string) {
		return this.findOne({
			aliases: { $in: [name] },
		});
	}
}

export const TagModel = getModelForClass(Tag, {
	schemaOptions: { timestamps: true },
});
