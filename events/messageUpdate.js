module.exports = {
    run: async (client, msgb, msga) => {
        if (msgb.embeds.length == 0 && msgb.content != msga.content && msga.channel.id) {
            client.log(`:pencil: ${msgb.author.tag} (\`${msgb.author.id}\`) message edited in **#${msgb.channel.name}**: \n**B**: ${msgb.content}\n**A**: ${msga.content}`);
        }
    }
}