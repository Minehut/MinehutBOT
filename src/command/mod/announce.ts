import { Message } from 'discord.js';
import { MinehutCommand } from '../../structure/command/minehutCommand';
import { PermissionLevel } from '../../util/permission/permissionLevel';
import { PrefixSupplier } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { MESSAGES } from '../../util/constants';
import { Announcer } from '../../guild/config/feature/announcement';
import { guildConfigs } from '../../guild/config/guildConfigs';

export default class AnnounceEventCommand extends MinehutCommand {
	constructor() {
		super('announce', {
			aliases: ['announce'],
			category: 'mod',
			channel: 'guild',
			permissionLevel: PermissionLevel.Moderator,
			description: {
				content: 'Announce an event',
				usage: '<announcer> <content> [--mention]',
				examples: [
					'event --mention The sheep shearing event is starting now! Join the Events voice channel :)',
					'-m event Shorter way of saying mention',
					'event This is not an important announcement so it does not require a mention',
				],
			},
			args: [
				{
					id: 'announcer',
					type: 'announcer',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which announcer would you like to use?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid announcer. Use \`announce list\` for a list of available announcers.`,
					},
				},
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
					match: 'flag',
					flag: ['--mention', '-m'],
				},
			],
		});
	}

	async exec(
		msg: Message,
		{
			announcer,
			content,
			mention,
		}: {
			announcer: Announcer;
			content: string;
			mention: boolean;
		}
	) {
		if (!guildConfigs.get(msg.guild?.id!)?.features.announcement?.announcers)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} announcement feature not configured`
			);
		const prefix = (this.handler.prefix as PrefixSupplier)(msg) as string;
		if (!content)
			return msg.channel.send(MESSAGES.commands.useHelp(prefix, 'announce'));

		const announcers = guildConfigs
			.get(msg.guild?.id!)!
			.features.announcement?.announcers.map(a => `\`${a.name}\``)!;
		if (!announcer)
			return msg.channel.send(
				`:loudspeaker: available announcers: ${announcers.join(', ')}`
			);

		const role = msg.guild!.roles.cache.get(announcer.role);
		if (!role)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} could not get announcer role`
			);

		const channel = msg.guild!.channels.cache.get(
			announcer.channel
		) as TextChannel;
		if (!channel)
			return msg.channel.send(
				`${process.env.EMOJI_CROSS} could not get announcer channel`
			);

		if (mention) await role.setMentionable(true);
		await channel.send(`${content}${mention ? `\n\n${role.toString()}` : ''}`);
		if (mention) await role.setMentionable(false);
	}
}
