module.exports = {
    run: async (client, msg, args) => {
        try {
            const code = args.join(" ");
            let evaled = eval(code);
      
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
            msg.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
          } catch (err) {
            msg.channel.send(`\`\`xl\n${clean(err)}\`\`\``);
          }    
    },
    meta: {
        aliases: ['eval'],
        description: 'Eval a command!',
        permlvl: 6,
        modCmd: false,
        usage: '<code>'           
    }    
}

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }