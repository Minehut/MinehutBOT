const fs = require('fs');
const Discord = require('discord.js');
const filters = require('../filter.json');
module.exports = {
    run: async (client, msg) => {
				if (msg.author.bot) return;
				if (msg.guild.id === client.config.guildid && (msg.channel.id !== '585753135742582786') && msg.channel.id !== '676533595648688149' && client.elevation(msg) < 4) {
					// Chat filter
					const matches = filters.filter(f => f.enabled && new RegExp(f.rule).test(msg.content.toLowerCase()));
					if (matches.length > 0) {
						const match = matches[0];
						msg.delete();
						switch (match.type.toLowerCase()) {
							case 'swear':
								let m = await msg.channel.send(`${msg.author}, please do not swear on the Minehut discord. Thanks! ^_^`);
								setTimeout(() => m.delete(), 5000);
								break;
							case 'spam':
								let m = await msg.channel.send(`${msg.author}, please do not spam on the Minehut discord. Thanks! ^_^`);
								setTimeout(() => m.delete(), 5000);
								break;
						}
						return;
					}
				}
        let userData = await client.db.table('userData').get(msg.author.id).run();
        if (!userData) {
            const user = msg.author;
            userData = { id: user.id, user: { id: user.id, tag: user.tag, username: user.username, avatarURL: user.avatarURL }, muted: false, msgs: 0 };
            client.db.table('userData').insert(userData).run();
        }
        if (msg.content.startsWith(client.config.prefix)) {
            const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            const tag = await client.db.table('tags').get(command).run();
            const tags = await client.db.table('tags').run();
            tags.forEach(tag => {
                const aliases = tag.aliases;
                if (aliases) {
                    if (aliases.includes(command)) {
                        client.db.table('tags').get(tag.id).update({ uses: tag.uses + 1 }).run();
                        msg.channel.send(tag.content);
                    }
                }
            });
            if (!tag) {
                try {
                    fs.readdir('commands', (err, files) => {
                        if (err) return console.error(err);
                        files.forEach(async file => {
                            const meta = require('../commands/' + file).meta;
                            const perms = client.elevation(msg);
                            if (meta.aliases.includes(command)) {
                                if (msg.guild.id === client.config.staffguild) {
                                    client.log(`\`[STAFF]\` :wrench: ${msg.author.tag} (\`${msg.author.id}\`) used command in **#${msg.channel.name}** \`${msg.content}\``);
                                } else {
                                    client.log(`:wrench: ${msg.author.tag} (\`${msg.author.id}\`) used command in **#${msg.channel.name}** \`${msg.content}\``);
                                }
                                if (meta.permlvl > perms) return;
                                if (meta.modCmd == true && msg.guild.id != client.config.guildid) return;
                                return require('../commands/' + file).run(client, msg, args);    
                            }
                        });    
                    });
                } catch (err) {
                    console.log(err);
                }                
            } else {
                client.db.table('tags').get(tag.id).update({ uses: tag.uses + 1 }).run();
                msg.channel.send(tag.content);
            }
        }
            if (msg.content.includes('discord.gg')) {
                const perms = client.elevation(msg);
                if (perms >= 4) return;
                const msgarray = msg.content.split(" ");    
                const invitestring = msgarray.filter(element => {
                    return element.includes('discord.gg');
                });    
                const invite = await client.fetchInvite(invitestring);
                const invwl = await client.db.table('automodData').get('whitelisted-invites').run();
                if (!invwl.invites.includes(invite.guild.id)) {
                    msg.delete();
                    client.log(`:no_entry_sign: censored message by ${msg.author.tag} (\`${msg.author.id}\`) in ${msg.channel.name} (\`${msg.channel.id}\`) invite \`${invite.code}\` to ${invite.guild.name}: \n${msg.content}`);
                } else return;
            }

            if (msg.content.includes('discordapp.com/invite')) {
                const perms = client.elevation(msg);
                if (perms >= 4) return;
                const msgarray = msg.content.split(' ');
                const invitestring = msgarray.filter(element => {
                    return element.includes('discordapp.com/invite');
                });
                const invite = await client.fetchInvite(invitestring);
                const invwl = await client.db.table('automodData').get('whitelisted-invites').run();
                if (!invwl.invites.includes(invite.guild.id)) {
                    msg.delete();
                    client.log(`:no_entry_sign: censored message by ${msg.author.tag} (\`${msg.author.id}\`) in ${msg.channel.name} (\`${msg.channel.id}\`) invite \`${invite.code}\` to ${invite.guild.name}: \n${msg.content}`);
                } else return;
            }
            
            if (msg.mentions.users.size >= 10) {
                const user = msg.author;
                const date = new Date();
                const seconds = 2 * 3600;
                const expDate = date.setSeconds(seconds);
                const reason = 'Spam (Too many mentions)'
                const numData = await client.db.table('numData').get('punishments').run();
                const id = numData.number;
                const datepunished = new Date();
                const num2insert = numData.number+1;
                client.log(`:helmet_with_cross: ${msg.author.tag} (\`${msg.author.id}\`) violated MAX_MENTIONS (<#${msg.channel.id}>): Too Many Mentions (${msg.mentions.users.size})`);
                client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: {name: client.user.tag, id: client.user.id }, reason: reason, type: 'MUTE', date: datepunished, dateExpired: expDate, active: true }).run();
                client.db.table('userData').get(user.id).update({ muted: true }).run();
                client.db.table('numData').get('punishments').update({ number: num2insert }).run();
                const embed = new Discord.RichEmbed()
                .setDescription('You have been temporarily muted on Minehut!')
                .addField('ID', id, true)
                .addField('Moderator', client.user.tag, true)
                .addField('Reason', reason, true)
                .addField('Duration', `2h`, true)
                .setColor('#FF0000')
                .setFooter(`Punished: ${datepunished}`);
                try {
                    user.send(embed);
                } catch (e) {
                    
                }
                const muted = msg.guild.roles.find(role => role.name === 'Muted');
                msg.member.addRole(muted);
            }
        }
    }
