// Eval command given by Riley (https://github.com/RileyDatLord)

const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        try {
            const code = args.join(" ");
            let evaled = eval(code);
      
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
            var embed = new Discord.RichEmbed()
            .setTitle('Eval - Success')
            .addField('Input', `\`\`\`js\n${code}\`\`\``)
            .addField('Output', `\`\`\`js\n${clean(evaled)}\`\`\``)
            .setColor('GREEN')
            .setTimestamp()
            msg.channel.send(embed);
          } catch (err) {
            const code = args.join(" ");
            var embed = new Discord.RichEmbed()
            .setTitle('Eval - Error')
            .addField('Input', `\`\`\`js\n${code}\`\`\``)
            .addField('Error', `\`\`\`xl\n${clean(err)}\`\`\``)
            .setColor('RED')
            .setTimestamp()
            msg.channel.send(embed);
          }    
    },
    meta: {
        aliases: ['eval'],
        description: 'Eval a command!',
        permlvl: 5,
        usage: '<code>'           
    }    
}

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }