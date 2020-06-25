import { randomAlphanumericString } from "../../util/util";

export class Action {
	private _id: string;
	
	constructor() {
		this._id = randomAlphanumericString(4);
	}

	get id() {
		return this._id;
	}
}
