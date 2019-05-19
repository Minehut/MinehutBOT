module.exports = {
    run: async (client, membera, memberb) => {
        if (membera.nickname == membera.user.name && memberb.nickname != memberb.user.name) {
            client.log(`:name_badge: ${membera.user.tag} (\`${membera.user.id}\`) added nickname \`${memberb.nickname}\``);
        } else if (memberb.nickname == memberb.user.name && membera.nickname != membera.user.name) {
            client.log(`:name_badge: ${membera.user.tag} (\`${membera.user.id}\`) removed nickname \`${membera.nickname}\``);
        }
    }
}