module.exports = {
    run: async (client, msg) => {
        if (msg.channel.id != client.config.logchannel && !msg.content.includes('discord.gg') && !msg.content.includes('discordapp.com/invite') && !msg.author.bot) {
            if (msg.guild.id === client.config.staffguild) {
                const logmsg = await client.log(`\`[STAFF]\` :wastebasket: ${msg.author.tag} (\`${msg.author.id}\`) message deleted in **#${msg.channel.name}**: (\`${msg.channel.id}\`)\n${client.replaceMentions(msg)}`);
                client.sendAttachments(msg, logmsg);    
            } else {
                const logmsg = await client.log(`:wastebasket: ${msg.author.tag} (\`${msg.author.id}\`) message deleted in **#${msg.channel.name}**: (\`${msg.channel.id}\`)\n${client.replaceMentions(msg)}`);
                client.sendAttachments(msg, logmsg);    
            }    
        } else return;
    }
}