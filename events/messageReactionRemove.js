module.exports = {
    run: async (client, msgReaction, user) => {
        const emoji = msgReaction.emoji;
        const member = (await msgReaction.message.guild.fetchMembers()).members.get(user.id);
        if (msgReaction.message.id == client.config.rolechannel) {
            if (emoji.id == client.config.hpemojiid) {
                const eventsrole = msgReaction.message.guild.roles.find(role => role.name === 'Events');
                if (eventsrole) {
                    member.removeRole(eventsrole);
                } else return;
            } else if (emoji.name == '📺') {
                const streamrole = msgReaction.message.guild.roles.find(role => role.name === 'Livestreams');
                if (streamrole) {
                    member.removeRole(streamrole);
                } else return;
            } else if (emoji.name == '📰') {
                const changelogrole = msgReaction.message.guild.roles.find(role => role.name === 'Changelog');
                if (changelogrole) {
                    member.removeRole(changelogrole);
                } else return;
            } else return;
        } else return;
    }
}