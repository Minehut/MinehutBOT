import { Message } from 'discord.js';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { guildConfigs } from '../../guild/config/guildConfigs';
import { emoji, messages } from '../../util/messages';
import { PrefixSupplier } from 'discord-akairo';
import { TextChannel } from 'discord.js';

export default class AnnounceEventCommand extends MinehutCommand {
	constructor() {
		super('announceEvent', {
			aliases: ['announceevent'],
			category: 'utility',
			channel: 'guild',
			permissionLevel: PermissionLevel.Moderator,
			description: {
				content: 'Announce an event',
				usage: '<content> [--mention]',
			},
			args: [
				{
					id: 'content',
					match: 'rest',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, what message would you like to announce?`,
					},
				},
				{
					id: 'mention',
					match: 'option',
					flag: ['--mention', '-m'],
					default: false,
				},
			],
		});
	}

	async exec(
		msg: Message,
		{
			content,
			mention,
		}: {
			content: string;
			mention: boolean;
		}
	) {
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		if (!content)
			return msg.channel.send(
				messages.commands.common.useHelp(prefix, 'announceevent')
			);

		const config = guildConfigs.get(msg.guild!.id);
		if (
			!config ||
			!config.features.announcements ||
			!config.features.announcements.announcers.find(a => a.name === 'event')
		)
			return msg.channel.send(
				`${emoji.cross} improper config, contact a bot developer`
			);

		const announcer = config.features.announcements.announcers.find(
			a => a.name === 'event'
		)!;

		const role = msg.guild!.roles.cache.get(announcer.role);
		if (!role)
			return msg.channel.send(`${emoji.cross} could not get events role`);

		const channel = msg.guild!.channels.cache.get(
			announcer.channel
		) as TextChannel;
		if (!channel)
			return msg.channel.send(`${emoji.cross} could not get events channel`);

		if (mention) await role.setMentionable(true);
		await channel.send(`${content}${mention ? `\n\n${role.toString()}` : ''}`);
		if (mention) await role.setMentionable(false);
	}
}
