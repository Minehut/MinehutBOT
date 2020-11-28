import { Collection } from 'discord.js';

const EXPIRED_MS = 8.64e7; // 24 hours

export class CacheManager<K, V> {
	private store: Collection<K, V>;
	private time: Collection<K, Date | number>;

	constructor() {
		this.store = new Collection();
		this.time = new Collection();
	}

	isInCache(key: K) {
		if (this.store.has(key)) return true;
		return false;
	}

	getValue(key: K) {
		if (this.store.has(key) && this.time.has(key)) return this.store.get(key);
		return null;
	}

	getLastUpdate(key: K) {
		if (this.time.has(key) && this.store.has(key)) return this.time.get(key);
		return null;
	}

	addIssue(key: K, value: V) {
		this.store.set(key, value);
		this.time.set(key, Date.now());
		setTimeout(() => this.removeIssue(key), EXPIRED_MS);
	}

	removeIssue(key: K) {
		if (this.store.delete(key) && this.time.delete(key)) return true;
		return false;
	}

	getType() {
		if (typeof this.store === typeof this.time) return typeof this.store;
		return null;
	}
}
