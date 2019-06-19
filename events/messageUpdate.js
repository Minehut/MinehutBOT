module.exports = {
    run: async (client, msgb, msga) => {
        if (msgb.embeds.length == 0 && msgb.content != msga.content && msga.channel.id && !msga.author.bot) {
            const logmsg = await client.log(`:pencil: ${msgb.author.tag} (\`${msgb.author.id}\`) message edited in **#${msgb.channel.name}**: \n**B**: ${client.replaceMentions(msgb)}\n**A**: ${await client.replaceMentions(msga)}`);
            client.sendAttachments(msga, logmsg);
        }
    }
}