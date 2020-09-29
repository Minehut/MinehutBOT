import { Mongoose } from 'mongoose';

export interface MinehutClientOptions {
	ownerIds?: string[];
	prefix?: string;
	mongo?: Mongoose;
}
