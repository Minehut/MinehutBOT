import { MinehutCommand } from '../../structure/command/minehutCommand';
import { CollectorFilter, Message, MessageEmbed } from 'discord.js';
import { prettyDate } from '../../util/functions';
import { Addon } from 'minehut/dist/addon/Addon';

const LINK_MATCH = /^http.*/gm;

export default class AddonInfoCommand extends MinehutCommand {
	constructor() {
		super('addonInfo', {
			aliases: ['addon', 'addoninfo'],
			description: {
				content: 'Look up an addon on Minehut',
				usage: '<addon>',
				examples: ['EssentialsX', 'Pixelmon', '5cd4a954cfee65422e52f5c8'],
			},
			category: 'info',
			args: [
				{
					id: 'query',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what addon would you like to look up?`,
						retry: (msg: Message) =>
							`${msg.author}, please provide an addon name or ID.`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { query }: { query: string }) {
		const m = await msg.channel.send(
			`${process.env.EMOJI_LOADING} fetching addon **${query}**`
		);

		const addons = await this.client.minehutApi.addons.search(query);
		let addon: Addon;

		if (addons.length < 1)
			return m.edit(`${process.env.EMOJI_CROSS} unknown addon`);
		else if (addons.length > 20) {
			console.log(addons.map(p => p.title));
			return m.edit(
				`${process.env.EMOJI_CROSS} try to narrow down your search query`
			);
		} else if (addons.length === 1) addon = addons[0];
		else {
			const max = addons.length;
			const addonList = addons.map(
				(addon, index) => `${index + 1}) ${addon.title} (${addon.category})`
			);

			await m.edit(`
			Did you mean one of these? (pick 1-${max}) \`\`\`${addonList.join(
				'\n'
			)}\`\`\``);

			const idFilter = <CollectorFilter<Message[]>>(
				(input => msg.author.id === input.author.id)
			);

			const idMessages = await msg.channel.awaitMessages({
				filter: idFilter,
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

			addon = addons[id - 1];
		}

		// const extendedDescription = addon.description
		// 	.replace(/Plugin Link(:)?/gm, '')
		// 	.replace(LINK_MATCH, '')
		// 	.trim();

		const match = addon.description.match(LINK_MATCH);
		const link = match ? match[0] : null;

		const isFree = addon.price < 1;

		const embed = new MessageEmbed()
			.setTitle(`${addon.title} (${addon.category})`)
			.setColor(isFree ? 'GREEN' : 'BLUE');

		if (!isFree) embed.addField('Price', `${addon.price} credits`, true);

		embed.addField('Addon Version', `\`${addon.version}\``, true);

		embed
			.addField('Added', prettyDate(addon.createdAt))
			.addField('Updated', prettyDate(addon.updatedAt), true)
			.setFooter(
				`Requested by ${msg.author.tag}`,
				msg.author.displayAvatarURL()
			);

		if (link) embed.addField('Link', link);
		if (addon.shortDescription && addon.shortDescription.length > 0)
			embed.setDescription(addon.shortDescription);

		return m.edit({ content: null, embeds: [embed] });
	}
}
