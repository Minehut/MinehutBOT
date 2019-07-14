module.exports = {
    run: async (client, msgReaction, user) => {
        const emoji = msgReaction.emoji;
        const member = (await msgReaction.message.guild.fetchMembers()).members.get(user.id);
        if (msgReaction.message.id == client.config.rolechannel) {
            console.log(emoji.name);
            if (emoji.name == 'HypeBadge') {
                const eventsrole = msgReaction.message.guild.roles.find(role => role.name === 'Events');
                if (eventsrole) {
                    member.addRole(eventsrole);
                } else return;
            } else if (emoji.name == '📺') {
                const streamrole = msgReaction.message.guild.roles.find(role => role.name === 'Livestreams');
                if (streamrole) {
                    member.addRole(streamrole);
                } else return;
            } else if (emoji.name == '📰') {
                const changelogrole = msgReaction.message.guild.roles.find(role => role.name === 'Changelog');
                if (changelogrole) {
                    member.addRole(changelogrole);
                } else return;
            } else return;
        } else return;
    }
}