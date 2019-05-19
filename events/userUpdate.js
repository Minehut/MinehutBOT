module.exports = {
    run: async (client, userb, usera) => {
        if (userb.tag != usera.tag) {
            client.log(`:name_badge: ${usera.tag} (\`${usera.id}\`) changed username from \`${userb.tag}\` to \`${usera.tag}\``);
        } else return;
    }
}