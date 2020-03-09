const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        const tags = await client.db.table('tags').run();
        if (tags.length == 0) return msg.channel.send(':x: There are no tags!');
        const tagnames = [];
        tags.forEach(tag => {
            tagnames.push(`\`${tag.id}\``);
        });
        const embed = new Discord.RichEmbed()
        .setDescription(`${tagnames.join(', ')}`)
        .setColor('BLUE');
        msg.channel.send(embed);
    },
    meta: {
        aliases: ['tags'],
        description: '',
        permlvl: 0,
        modCmd: false,
        usage: ''  
    }
}