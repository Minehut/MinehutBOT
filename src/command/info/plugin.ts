import { MinehutCommand } from '../../structure/command/minehutCommand';
import { Message, MessageEmbed } from 'discord.js';
import { prettyDate } from '../../util/functions';
import fetch from 'node-fetch';

const LINK_MATCH = /^http.*/gm;

export default class PluginInfoCommand extends MinehutCommand {
	constructor() {
		super('pluginInfo', {
			aliases: ['plugin'],
			description: {
				content: 'Look up a plugin on Minehut',
				usage: '<plugin>',
				examples: ['EssentialsX', '5cd4a954cfee65422e52f5c8'],
			},
			category: 'info',
			args: [
				{
					id: 'pluginName',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what plugin would you like to look up?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide a plugin name or ID.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { pluginName }: { pluginName: string }) {
		const m = await msg.channel.send(
			`${process.env.EMOJI_LOADING} fetching plugin **${pluginName}**`
		);
		const plugins = await this.getData(
			'https://api.minehut.com/plugins_public'
		);
		const plugin = plugins.all.filter(
			(x: any) =>
				x.name.toLowerCase() === pluginName.toLowerCase() ||
				x._id.toLowerCase() === pluginName.toLowerCase()
		)[0];
		if (!plugin)
			return m.edit(`${process.env.EMOJI_CROSS} could not fetch plugin`);
		const link = plugin.desc_extended.match(LINK_MATCH)[0];
		const embed: MessageEmbed = new MessageEmbed();
		embed.setTitle(`${plugin.name}`);
		embed.setDescription(plugin.desc);
		embed.setColor('BLUE');
		embed.addField('Private?', plugin.credits === 0 ? 'No' : 'Yes', true);
		embed.addField('Disabled?', plugin.disabled ? 'Yes' : 'No', true);
		embed.addField('Version', plugin.version, true);
		embed.addField('File Name', plugin.file_name, true);
		if (link) embed.addField('Plugin Link', link, true);
		embed.addField('Created', prettyDate(new Date(plugin.created)));
		embed.addField('Last Updated', prettyDate(new Date(plugin.last_updated)));
		embed.setFooter(
			`Requested by ${msg.author.tag}`,
			msg.author.displayAvatarURL()
		);
		return m.edit({ content: null, embed });
	}

	async getData(url: string) {
		try {
			const response = await fetch(url);
			const json = response.json();
			return json;
		} catch (e) {
			if (process.env.NODE_ENV === 'development') console.log(e);
		}
	}
}
