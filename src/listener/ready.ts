import { Listener } from 'discord-akairo';
import { guildConfigs } from '../guild/config/guildConfigs';
import { Guild } from 'discord.js';
import numeral from 'numeral';

export default class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	async exec() {
		console.log(`Logged in as ${this.client.user?.tag}`);
		this.client.guilds.cache.forEach(g => {
			if (!guildConfigs.has(g.id!))
				throw new Error(`Missing guild configuration for ${g.name} (${g.id})`);
		});

		let mainGuild: Guild | undefined;
		guildConfigs.forEach(async c => {
			if (!this.client.guilds.cache.has(c.id)) return;
			if (!mainGuild && c.main) mainGuild = this.client.guilds.cache.get(c.id)!;
		});
		if (mainGuild) {
			const memberCount = numeral(mainGuild.memberCount).format('0.0a');
			this.client.user?.setActivity(`👀 ${memberCount}`, {
				type: 'WATCHING',
			});

			const updateStatus = async () => {
				try {
					const simpleStats = await this.client.minehutApi.getSimpleStats();
					if (simpleStats.playerCount == 0 || simpleStats.serverCount == 0) return this.client.user?.setStatus('idle');
					this.client.user?.setStatus('online');
				} catch(e) { 
					this.client.user?.setStatus('dnd');
				}
			}

			setInterval(updateStatus, 30000);
		}

		await this.client.banScheduler.refresh();
	}
}
