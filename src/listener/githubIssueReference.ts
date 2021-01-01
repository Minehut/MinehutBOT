import { Listener } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { truncate } from 'lodash';
import { guildConfigs } from '../guild/config/guildConfigs';
import { capitalize } from 'lodash';
import { MinehutClient } from '../client/minehutClient';
import { getIssue } from '../util/functions';

export default class GithubIssueReferenceListener extends Listener {
	client: MinehutClient;

	constructor(client: MinehutClient) {
		super('githubIssueReference', {
			emitter: 'commandHandler',
			event: 'messageInvalid',
		});
		this.client = client;
	}
	async exec(msg: Message) {
		if (!msg.guild) return;
		const config = guildConfigs.get(msg.guild.id);
		if (!config || !config.features.githubIssue) return;
		if (config.features.githubIssue.ignoredChannels?.includes(msg.channel.id))
			return;
		const messageMatch = msg.content.match(/#\d+/);

		if (messageMatch) {
			const issueNumber = parseInt(messageMatch[0].slice(1));
			if (
				this.client.githubCooldownManager.isOnCooldown(
					`gh-${issueNumber}-${msg.channel.id}`
				)
			)
			return msg.react('⏲️');
			const issue = await getIssue(
				this.client,
				config.features.githubIssue.githubRepoOwner,
				config.features.githubIssue.githubRepoName,
				issueNumber
			);
			if (issue) {
				const embed = new MessageEmbed()
					.setTitle(`${issue.data.title} (#${issue.data.number})`)
					.setURL(issue.data.html_url);
				const body = issue.data.body
					.replace(/<!--(.|\n|\r)*?-->/g, '') // Removes markdown comments
					.replace(/(\n|\r){3,}/gi, '\n\n') // Replaces line breaks of 3 lines, or more, with 2
					.trim()
					.replace(
						/(.|\n|\r)*Checklist*((.|\n|\r)*?(((-( )?)?\[.*\]|-))){4}.+/gi,
						''
					) // Remove checklist
					.replace(/(\*\*.+\*\*)\n\n/gi, '$1\n'); // Removes space after headers to make embeds more compact
				embed
					.setDescription(truncate(body, { length: 500 }))
					.setAuthor(
						issue.data.user.login,
						issue.data.user.avatar_url,
						issue.data.user.html_url
					)
					.setColor(issue.data.state === 'open' ? 'GREEN' : 'RED')
					.setFooter(
						issue.data.labels
							.map((m: { name: string }) => m.name.replace(/\w+/g, capitalize))
							.join(' • ')
					)
					.setTimestamp(Date.parse(issue.data.created_at));
				await msg.channel.send(embed);
				this.client.githubCooldownManager.add(
					`gh-${issue.data.number}-${msg.channel.id}`
				);
			}
		}
	}
}
