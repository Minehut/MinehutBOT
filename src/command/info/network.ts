import { MinehutCommand } from '../../structure/command/minehutCommand';
import { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

export default class NetworkStatsCommand extends MinehutCommand {
	constructor() {
		super('networkStats', {
			aliases: ['networkstats'],
			description: {
				content: 'Check network stats',
			},
			category: 'info',
		});
	}

	async exec(msg: Message) {
		const m = await msg.channel.send(
			`${process.env.EMOJI_LOADING} fetching network stats`
		);
		try {
			const simpleStats = await this.client.minehutApi.getSimpleStats();
			const playerDistribution = await this.client.minehutApi.getPlayerDistribution();
			const embed = new MessageEmbed();
			embed.setTitle('Network Stats');
			embed.setDescription(`
				**Total Servers**: ${simpleStats.serverCount}/${simpleStats.serverMax}
				**Total Players**: ${simpleStats.playerCount}
				**RAM Usage**: ${simpleStats.ramCount}/${simpleStats.ramMax} GB

				**__Bedrock Players__**
				\* Total: ${playerDistribution.bedrock.total}
				\* Lobby: ${playerDistribution.bedrock.lobby}
				\* On Player Servers: ${playerDistribution.bedrock.playerServer}

				**__Java Players__**
				\* Total: ${playerDistribution.java.total}
				\* Lobby: ${playerDistribution.java.lobby}
				\* On Player Servers: ${playerDistribution.java.playerServer}
			`);
			embed.setColor('BLUE');
			embed.setFooter(
				`Requested by ${msg.author.tag}`,
				msg.author.displayAvatarURL()
			);
			return m.edit(embed);
		} catch (e) {
			return m.edit(`${process.env.EMOJI_CROSS} could not fetch network stats`);
		}
	}
}
