import { MinehutCommand } from '../../structure/command/minehutCommand';
import { CollectorFilter, Message, MessageEmbed } from 'discord.js';
import { prettyDate } from '../../util/functions';
import { Plugin } from 'minehut/dist/plugin/Plugin';

const LINK_MATCH = /^http.*/gm;

export default class PluginInfoCommand extends MinehutCommand {
	constructor() {
		super('pluginInfo', {
			aliases: ['plugin', 'plugininfo'],
			description: {
				content: 'Look up a plugin on Minehut',
				usage: '<plugin>',
				examples: ['EssentialsX', '5cd4a954cfee65422e52f5c8'],
			},
			category: 'info',
			args: [
				{
					id: 'query',
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

	async exec(msg: Message, { query }: { query: string }) {
		const m = await msg.channel.send(
			`${process.env.EMOJI_LOADING} fetching plugin **${query}**`
		);

		const plugins = await this.client.minehutApi.plugins.search(query);
		let plugin: Plugin;

		if (plugins.length < 1)
			return m.edit(`${process.env.EMOJI_CROSS} unknown plugin`);
		else if (plugins.length > 20) {
			console.log(plugins.map(p => p.name));
			return m.edit(
				`${process.env.EMOJI_CROSS} try to narrow down your search query`
			);
		} else if (plugins.length === 1) plugin = plugins[0];
		else {
			const max = plugins.length;
			const pluginList = plugins.map(
				(plugin, index) => `${index + 1}) ${plugin.name}`
			);

			await m.edit(`
			Did you mean one of these? (pick 1-${max}) \`\`\`${pluginList.join(
				'\n'
			)}\`\`\``);

			const idFilter = <CollectorFilter>(
				((input: Message) => msg.author.id === input.author.id)
			);

			const idMessages = await msg.channel.awaitMessages(idFilter, {
				max: 1,
				time: 30000,
			});

			// Delete the number message by the user
			idMessages.forEach(m => m.delete());

			const id = idMessages.map(m => Number(m.content))[0];
			if (!id || id < 1 || id > max)
				return m.edit(
					`${process.env.EMOJI_CROSS} you need to specify a number between 1-${max}`
				);

			plugin = plugins[id - 1];
		}

		const extendedDescription = plugin.extendedDescription
			.replace(/Plugin Link(:)?/gm, '')
			.replace(LINK_MATCH, '')
			.trim();

		const match = plugin.extendedDescription.match(LINK_MATCH);
		const link = match ? match[0] : null;

		const isPrivate = plugin.credits > 0;

		const embed = new MessageEmbed()
			.setTitle(plugin.name)
			.setDescription(extendedDescription)
			.setColor(isPrivate ? 'RED' : 'BLUE')
			.addField('Added', prettyDate(plugin.createdAt))
			.addField('Updated', prettyDate(plugin.lastUpdatedAt), true)
			.addField('Version', `\`${plugin.version}\``)
			.setFooter(
				`Requested by ${msg.author.tag}`,
				msg.author.displayAvatarURL()
			);

		if (link) embed.addField('Link', link);

		return m.edit({ content: null, embed });
	}
}
