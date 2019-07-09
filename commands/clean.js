module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: Invalid args! Usage: `!clean <all/user/bots> <snowflake/id(if applicable)> <count>`');
        if (args[0] == 'all') {
            if (!args[1]) return msg.channel.send(':x: Must include count');
            const msgs = parseInt(args[1], 10);
            if (msgs == NaN) return msg.channel.send(':x: Count must be a number');
            if (msgs >= 2) {
                if (msgs <= 100) {
                    const channel = client.channels.get(msg.channel.id);
                    msg.delete();
                    channel.bulkDelete(msgs).then(() => {
                        msg.channel.send(`:ok_hand: cleared ${msgs} messages`).then(cmsg => {
                            setTimeout(function() {
                                cmsg.delete();
                            }, 5000);
                        });
                    });
                } else return msg.channel.send(':x: Count must be lower than 100.');
            } else return msg.channel.send(':x: Count must be above 1.');
        } else if (args[0] == 'bots') {
            if (!args[1]) return msg.channel.send(':x: Must include count');
            const count = parseInt(args[1], 10);
            if (count == NaN) return msg.channel.send(':x: Count must be a number');
            if (count >= 2) {
                if (count <= 100) {
                    const channel = msg.channel;
                    channel.fetchMessages().then(msgs => {
                        const filtered = msgs.filter(m => m.author.bot);
                        const datefiltered = filtered.sort(m => m.createdTimestamp);
                        const array = datefiltered.array();
                        while (array.length >= count) {
                            array.pop();
                        }
                        channel.bulkDelete(array).then(() => {
                            msg.delete();
                            msg.channel.send(`:ok_hand: cleared ${array.length} messages`).then(smsg => {
                                setTimeout(function() {
                                    smsg.delete();
                                }, 5000);
                            });
                        });
                    });
                } else return msg.channel.send(':x: Count must be lower than 100.');
            } else return msg.channel.send(':x: Count must be above 1.');
        } else if (args[0] == 'user') {
            let user;
            if (msg.mentions.users.size > 0) {
                user = msg.mentions.users.first();
            } else user = client.users.get(args[1]);
            if (!user) return msg.channel.send(':x: Invalid user');
            if (!args[2]) return msg.channel.send(':x: Must include count');
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
                            msg.channel.send(`:ok_hand: cleared ${array.length} messages`).then(smsg => {
                                setTimeout(function() {
                                    smsg.delete();
                                }, 5000);
                            });
                        });
                    });
                } else return msg.channel.send(':x: Count must be lower than 100.');
            } else return msg.channel.send(':x: Count must be above 1.');
        }
    },
    meta: {
        aliases: ['clean'],
        description: 'Clean a specific amount of messages',
        permlvl: 4,
        modCmd: true,
        usage: ''           
    }
}