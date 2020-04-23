const filters = require('../filter.json');
module.exports = {
    run: async (client, msgb, msga) => {
        if (msgb.embeds.length == 0 && msgb.content != msga.content && msga.channel.id && !msga.author.bot) {
					if (msga.guild.id === client.config.guildid && (msga.channel.id !== '585753135742582786') && msga.channel.id !== '676533595648688149' &&  client.elevation(msg) < 4) {
						// Chat filter
						const matches = filters.filter(f => f.enabled && new RegExp(f.rule).test(msga.content.toLowerCase()));
						if (matches.length > 0) {
							const match = matches[0];
							msga.delete();
							let m;
							switch (match.type.toLowerCase()) {
								case 'swear':
									m = await msga.channel.send(`${msga.author}, please do not swear on the Minehut discord. Thanks! ^_^`);
									setTimeout(() => m.delete(), 5000);
									break;
								case 'spam':
									m = await msga.channel.send(`${msga.author}, please do not spam on the Minehut discord. Thanks! ^_^`);
									setTimeout(() => m.delete(), 5000);
									break;
							}
							return;
						}
					}
            if (msgb.guild.id === client.config.staffguild) {
                const logmsg = await client.log(`\`[STAFF]\` :pencil: ${msgb.author.tag} (\`${msgb.author.id}\`) message edited in **#${msgb.channel.name}**: \n**B**: ${client.replaceMentions(msgb)}\n**A**: ${await client.replaceMentions(msga)}`);
                client.sendAttachments(msga, logmsg);    
            } else {
                const logmsg = await client.log(`:pencil: ${msgb.author.tag} (\`${msgb.author.id}\`) message edited in **#${msgb.channel.name}**: \n**B**: ${client.replaceMentions(msgb)}\n**A**: ${await client.replaceMentions(msga)}`);
                client.sendAttachments(msga, logmsg);    
						}
            if (msga.content.includes('discord.gg')) {
                const msgarray = msga.content.split(" ");    
                const invitestring = msgarray.filter(element => {
                    return element.includes('discord.gg');
                });    
                const invite = await client.fetchInvite(invitestring);
                const invwl = await client.db.table('automodData').get('whitelisted-invites').run();
                if (!invwl.invites.includes(invite.guild.id)) {
                    msga.delete();
                    client.log(`:no_entry_sign: censored message by ${msga.author.tag} (\`${msga.author.id}\`) in ${msga.channel.name} (\`${msga.channel.id}\`) invite \`${invite.code}\` to ${invite.guild.name}: \n${msga.content}`);
                } else return;
            }
        }
    }
}