import { Collection } from 'discord.js';

/* 
	This class can be used to manage caches for anything;
	It was originally created to manage the cache for github issue referencing
	But it is written in a way that it can be initialised and used to manage any cache
*/
export class CacheManager<K, V> {
	private store: Collection<K, V>;
	private time: Collection<K, Date | number>;

	constructor(private readonly expiredMS: number) {
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

	addValue(key: K, value: V) {
		this.store.set(key, value);
		this.time.set(key, Date.now());
		setTimeout(() => this.removeValue(key), this.expiredMS);
	}

	removeValue(key: K) {
		if (this.store.delete(key) && this.time.delete(key)) return true;
		return false;
	}

	getType() {
		if (typeof this.store) return typeof this.store;
		return null;
	}
}
