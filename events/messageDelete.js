module.exports = {
    run: async (client, msg) => {
        if (msg.channel.id != client.config.logchannel && !msg.content.includes('https://discord.gg' || 'http://discord.gg') && !msg.author.bot) {
        client.log(`:wastebasket: ${msg.author.tag} (\`${msg.author.id}\`) message deleted in **#${msg.channel.name}**: (\`${msg.channel.id}\`)\n${client.replaceMentions(msg)}`);
        } else return;
    }
}