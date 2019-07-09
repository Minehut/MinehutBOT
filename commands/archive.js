module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: Invalid args! Usage: `!archive <all/here/user/channel> <user/channel/snowflake/count> <count>`');
        if (args[0] == 'here') {
            if (args[1]) {
                const num = parseInt(args[1], 10);
                if (num == NaN) return msg.channel.send(':x: Count must be a number!');
                if (num >= 2) {
                    if (num <= 100) {
                        const channel = msg.channel;
                        msg.delete();
                        channel.bulkDelete(num).then((msgs) => {
                            const msgarray = msgs.array();
                            const formattedmsgarray = [];
                            msgarray.forEach(msg => {
                                formattedmsgarray.push(`${msg.author.tag} (${msg.author.id}) - ${msg.content}`);
                            });
                            client.pb.createPaste({ text: `Requested by: ${msg.author.tag}\n\n${formattedmsgarray.join('\n\n')}`, title: `${channel.name} - Archive`, format: null, privacy: 1, expiration: null }).then(pb => {
                                msg.channel.send(`:ok_hand: archived ${num} messages (${pb})`).then(cmsg => {
                                    setTimeout(function() {
                                        msg.author.send(`Here is the link for your previous archive consisting of ${num} messages: ${pb}.`);
                                        cmsg.delete();
                                    }, 5000);
                                });
                            });
                        });
                    } else return msg.channel.send(':x: Count must be lower than 100.');
                } else return msg.channel.send(':x: Count must be above 1.');
            } else {
                const channel = msg.channel;
                msg.delete();
                const msgs = await channel.fetchMessages();
                channel.bulkDelete(msgs).then((msgs) => {
                    const msgarray = msgs.array();
                    const formattedmsgarray = [];
                    msgarray.forEach(msg => {
                        formattedmsgarray.push(`${msg.author.tag} (${msg.author.id}) - ${msg.content}`);
                    });
                    client.pb.createPaste({ text: `Requested by: ${msg.author.tag}\n\n${formattedmsgarray.join('\n\n')}`, title: `${channel.name} - Archive`, format: null, privacy: 1, expiration: null }).then(pb => {
                        msg.channel.send(`:ok_hand: archived all messages in this channel (${pb})`).then(cmsg => {
                            setTimeout(function() {
                                msg.author.send(`Here is the link for your previous archive consisting of all messages in ${channel.name}: ${pb}.`);
                                cmsg.delete();
                            }, 5000);
                        });
                    });
                }); 
            }
        } else if (args[0] == 'user') {
            let user;
            if (msg.mentions.users.size > 0) {
                user = msg.mentions.users.first();
            } else user = client.users.get(args[1]);
            if (!user) return msg.channel.send(':x: Invalid user');
            if (args[2]) {
                const count = parseInt(args[2], 10);
                if (count == NaN) return msg.channel.send(':x: Count must be a number');
                if (count >= 2) {
                    if (count <= 100) {
                        const channel = msg.channel;
                        channel.fetchMessages().then(msgs => {
                            const filtered = msgs.filter(m => m.author.id === user.id);
                            const datefiltered = filtered.filter(m => m.createdTimestamp);
                            const array = datefiltered.array()
                            while (array.length > count) {
                                array.pop();
                            }
                            channel.bulkDelete(array).then(() => {
                                const formattedmsgarray = [];
                                array.forEach(msg => {
                                    formattedmsgarray.push(`${msg.author.tag} (${msg.author.id}) - ${msg.content}`);
                                });
                                client.pb.createPaste({ text: `Requested by: ${msg.author.tag}\n\n${formattedmsgarray.join('\n\n')}`, title: `${channel.name} (${user.tag}) - Archive`, format: null, privacy: 1, expiration: null }).then(pb => {
                                    msg.channel.send(`:ok_hand: archived ${count} messages by ${user.tag} in this channel (${pb})`).then(cmsg => {
                                        setTimeout(function() {
                                            msg.author.send(`Here is the link for your previous archive consisting of ${count} messages by ${user.tag} in ${channel.name}: ${pb}.`);
                                            cmsg.delete();
                                        }, 5000);
                                    });
                                });
                            });
                        });
                    } else return msg.channel.send(':x: Count must be lower than 100.');
                } else return msg.channel.send(':x: Count must be above 1.');   
            } else {
                const channel = msg.channel;
                channel.fetchMessages().then(msgs => {
                    const filtered = msgs.filter(m => m.author.id === user.id);
                    const array = filtered.array();
                    channel.bulkDelete(array).then(() => {
                        const formattedmsgarray = [];
                        array.forEach(msg => {
                            formattedmsgarray.push(`${msg.author.tag} (${msg.author.id}) - ${msg.content}`);
                        });
                        client.pb.createPaste({ text: `Requested by: ${msg.author.tag}\n\n${formattedmsgarray.join('\n\n')}`, title: `${channel.name} - Archive`, format: null, privacy: 1, expiration: null }).then(pb => {
                            msg.channel.send(`:ok_hand: archived all messages by ${user.tag} in this channel (${pb})`).then(cmsg => {
                                setTimeout(function() {
                                    msg.author.send(`Here is the link for your previous archive consisting of all messages by ${user.tag} in ${channel.name}: ${pb}.`);
                                    cmsg.delete();
                                }, 5000);
                            });
                        });
                    });
                });
            }
        } else if (args[0] == 'channel') {
            let channel;
            if (msg.mentions.channels.size > 0) {
                channel = msg.mentions.channels.first();
            } else channel = client.channels.get(args[1]);
            if (!channel) return msg.channel.send(':x: Invalid channel');
            if (args[2]) {
                const count = parseInt(args[2], 10);
                if (count == NaN) return msg.channel.send(':x: Count must be a number');
                if (count >= 2) {
                    if (count <= 100) {
                        channel.fetchMessages().then(msgs => {
                            const array = msgs.array();
                            while (array.length > count) {
                                array.pop();
                            }
                            channel.bulkDelete(array).then(() => {
                                const formattedmsgarray = [];
                                array.forEach(msg => {
                                    formattedmsgarray.push(`${msg.author.tag} (${msg.author.id}) - ${msg.content}`);
                                });
                                client.pb.createPaste({ text: `Requested by: ${msg.author.tag}\n\n${formattedmsgarray.join('\n\n')}`, title: `${channel.name} - Archive`, format: null, privacy: 1, expiration: null }).then(pb => {
                                    msg.channel.send(`:ok_hand: archived ${count} messages in ${channel.name} (${pb})`).then(cmsg => {
                                        setTimeout(function() {
                                            msg.author.send(`Here is the link for your previous archive consisting of ${count} messages by in ${channel.name}: ${pb}.`);
                                            cmsg.delete();
                                        }, 5000);
                                    });
                                });
                            });
                        });
                    } else return msg.channel.send(':x: Count must be lower than 100.');
                } else return msg.channel.send(':x: Count must be above 1.'); 
            } else {
                msg.delete();
                const msgs = await channel.fetchMessages();
                channel.bulkDelete(msgs).then((msgs) => {
                    const msgarray = msgs.array();
                    const formattedmsgarray = [];
                    msgarray.forEach(msg => {
                        formattedmsgarray.push(`${msg.author.tag} (${msg.author.id}) - ${msg.content}`);
                    });
                    client.pb.createPaste({ text: `Requested by: ${msg.author.tag}\n\n${formattedmsgarray.join('\n\n')}`, title: `${channel.name} - Archive`, format: null, privacy: 1, expiration: null }).then(pb => {
                        msg.channel.send(`:ok_hand: archived all messages in channel ${channel.name} (${pb})`).then(cmsg => {
                            setTimeout(function() {
                                msg.author.send(`Here is the link for your previous archive consisting of all messages in ${channel.name}: ${pb}.`);
                                cmsg.delete();
                            }, 5000);
                        });
                    });
                }); 
            }
        }
    },
    meta: {
        aliases: ['archive'],
        description: '',
        permlvl: 4,
        modCmd: true,
        usage: ''            
    }
}