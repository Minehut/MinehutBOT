import { prop, getModelForClass, Severity } from '@typegoose/typegoose';

export class PersistentData {
	@prop({ required: true })
	_id!: string;

	@prop({ required: true })
	value!: any;
}

export const PersistentDataModel = getModelForClass(PersistentData, {
	schemaOptions: { timestamps: true, collection: 'persistentdata' },
	options: { allowMixed: Severity.ALLOW },
});
