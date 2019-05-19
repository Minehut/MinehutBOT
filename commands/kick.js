const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must mention who you want to kick.');
        let user;
        if (msg.mentions.users.size > 0) {
            user = msg.mentions.users.first();
        } else user = client.users.get(args[0]);
        if (!user) return msg.channel.send(':x: Invalid user!');
        const member = msg.guild.members.get(user.id);
        if (client.checkPerms(msg, member) == false) return msg.channel.send(':x: Cannot punish this user as they are a staff!');
        const reason = args.slice(1).join(' ');
        if (!reason) return msg.channel.send(`:x: You must give a reason for why you want to kick ${user.tag}.`);
        const numData = await client.db.table('numData').get('punishments').run();
        const id = numData.number;
        const datepunished = new Date();
        const num2insert = numData.number+1;
        client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id, avatarURL: user.avatarURL }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'KICK', date: datepunished, active: false }).run();
        client.db.table('numData').get('punishments').update({ number: num2insert }).run();
        const embed = new Discord.RichEmbed()
        .setDescription('You have been kicked from Minehut!')
        .addField('ID', id, true)
        .addField('Moderator', msg.author.tag, true)
        .addField('Reason', reason, true)
        .setColor('#FF0000')
        .setFooter(`Punished: ${datepunished}`);
        user.send(embed).then(() => {
            member.kick(reason);
            msg.channel.send(`:ok_hand: kicked ${user.tag} (\`${reason}\`)`);  
        });      
    },
    meta: {
        aliases: ['kick'],
        description: 'Kicks a user for a specified reason',
        permlvl: 1,
        usage: ''              
    }
}