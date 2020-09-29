/*
    This manages any sort of influx, such as accounts joining that fulfils a condition or a user spamming.
    You can manage the quantity that it should go up to before executing, time between clears, and an action if it satisfies the condition.
*/

import { InfluxManagerOptions } from './InfluxManagerOptions';

export class InfluxManager<T> {
	private influxStore: T[];
	private influxOptions: InfluxManagerOptions<T>;
	private influxClearInterval: NodeJS.Timeout;

	constructor(influxStore: T[], influxOptions: InfluxManagerOptions<T>) {
		this.influxStore = influxStore;
		this.influxOptions = influxOptions;
		this.influxClearInterval = setInterval(
			() => this.clearInflux(),
			influxOptions.clearInterval
		);
	}

	clearInfluxInterval() {
		clearInterval(this.influxClearInterval);
	}

	clearInflux() {
		this.influxStore = [];
	}

	async addInflux(influx: T) {
		this.influxStore.push(influx);
		if (this.influxStore.length == this.influxOptions.executingQuantity) {
			// await it so it doesn't clear the influx before it completely executes if there's promises in the executing function
			await this.influxOptions.executingFunction(this.influxStore);
			// the influx store may be behind, so optionally include an after execution function to handle any cleanup after the action
			if (this.influxOptions.afterExecutionFunction)
				await this.influxOptions.afterExecutionFunction(this.influxStore);
			this.clearInflux();
		}
	}
}
