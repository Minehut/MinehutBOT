module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must mention who you want to ban.');
        const reason = args.slice(1).join(' ');
        if (!reason) return msg.channel.send(`:x: You must give a reason for why you want to ban this person.`);
        const member = (await msg.guild.fetchMembers()).members.get(user.id);
        if (member) return msg.channel.send(':x: Please use the \`!ban\` command for this user as they are apart of the guild.');
        msg.guild.ban(args[0], { reason: reason });
        msg.channel.send(`:ok_hand: banned user with id ${args[0]} (\`${reason}\`)`);   
    },
    meta: {
        aliases: ['forceban'],
        description: 'Forcebans a user for a specified reason',
        permlvl: 3,
        modCmd: true,
        usage: ''              
    }
}