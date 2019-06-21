module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: Invalid args! `Usage: !automod <censor> <invites> <whitelist/blacklist> <guild-id>`');
        if (args[0] == 'censor') {
            if (!args[1]) return msg.channel.send(':x: Invalid args! `Usage: !automod <censor> <invites> <whitelist/blacklist> <guild-id>`');
            if (args[1] == 'invites') {
                if (!args[2]) return msg.channel.send(':x: Invalid args! `Usage: !automod <censor> <invites> <whitelist/blacklist> <guild-id>`');
                if (args[2] == 'whitelist') {
                    const wlinv = await client.db.table('automodData').get('whitelisted-invites').run();
                    if (args[3].length != 18 || !args[3]) return msg.channel.send(':x: You must supply an ID of a guild to whitelist!');
                    if (wlinv.invites.includes(args[3])) return msg.channel.send(':x: This guild is already apart of the whitelisted invites!');
                    const wlinvarray = wlinv.invites;
                    wlinvarray.push(args[3]);
                    client.db.table('automodData').get('whitelisted-invites').update({ invites: wlinvarray }).run();
                    msg.channel.send(`:ok_hand: added guild with id \`${args[3]}\` to the invites whitelist`);
                } else if (args[2] == 'blacklist') {
                    const wlinv = await client.db.table('automodData').get('whitelisted-invites').run();
                    if (args[3].length != 18 || !args[3]) return msg.channel.send(':x: You must supply an ID of a guild to blacklist!');
                    if (!wlinv.invites.includes(args[3])) return msg.channel.send(':x: The guild is currently not whitelisted, so you can\'t blacklist it!');
                    const blinvarray = wlinv.invites;
                    const newarray = blinvarray.filter(e => e != args[3]);
                    client.db.table('automodData').get('whitelisted-invites').update({ invites: newarray }).run();
                    msg.channel.send(`:ok_hand: removed guild with id \`${args[3]}\` from the invites whitelist`);
                }
            }
        }
    },
    meta: {
        aliases: ['automod'],
        description: '',
        permlvl: 3,
        modCmd: false,
        usage: ''   
    }
}