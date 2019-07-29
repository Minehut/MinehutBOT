module.exports = {
    run: async (client, msg, args) => {
        if (!args) return msg.channel.send(':x: You must include user ids and a reason to mass ban!');
        if (!args.includes('-r')) return msg.channel.send(':x: You must include a reason for banning these accounts! (No flag found for reason)');
        let flagpos;
        for (var i = 0; i < args.length; i++) {
            const value = args[i];
            if (value === '-r') {
                flagpos = i;
                break;
            }
        }
        const ids = args.slice(0, flagpos);
        if (!ids || ids.length == 1) return msg.channel.send(':x: You must include 2 or more ids to mass ban!');
        const reason = args.slice(flagpos, flagpos + 2);
        if (!reason) return msg.channel.send(':x: You must include a reason for banning these accounts! (No reason found after flag)');
        const msg2edit = await msg.channel.send(`:ok_hand: banning \`${ids.length}\` accounts...`);
        const couldntban = [];
        ids.forEach(id => {
            msg.guild.ban(id, reason).catch(() => {
                couldntban.push(id);
            });
        });
        const banned = ids.length - couldntban.length;
        msg2edit.edit(`:ok_hand: banned \`${banned}\` accounts! (\`${reason}\`)`);
    },
    meta: {
        aliases: ['mban'],
        description: 'Mass ban a set of user ids',
        permlvl: 3,
        modCmd: true,
        usage: '' 
    }
}