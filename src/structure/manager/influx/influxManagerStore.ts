import { InfluxManager } from './influxManager';

export class InfluxManagerStore {
	private influxManagerStore: Map<string, InfluxManager<any>>;

	constructor() {
		this.influxManagerStore = new Map();
	}

	hasInfluxManager(key: string) {
		return this.influxManagerStore.has(key);
	}

	getInfluxManager(key: string) {
		return this.influxManagerStore.get(key);
	}

	registerInfluxManager(key: string, manager: InfluxManager<any>) {
		if (this.hasInfluxManager(key))
			throw new Error(
				'InfluxManager with the specified key has already been set'
			);
		this.influxManagerStore.set(key, manager);
	}

	deregisterInfluxManager(key: string) {
		if (!this.hasInfluxManager(key))
			throw new Error('InfluxManager with the specified key has not been set');
		const influxManager = this.getInfluxManager(key);
		influxManager!.clearInfluxInterval();
		this.influxManagerStore.delete(key);
	}
}
