const Discord = require("discord.js")
const settings = require("../settings.json")
const node = require('ptero-api')
const sql = require("sqlite")
sql.open("./users.sqlite")
module.exports.run = (client, message, args) => {
    sql.get(`SELECT * FROM users WHERE id = "${message.author.id}"`).then(row => {
        if (!row) {
            const user = message.author.username
            message.channel.send(client.noperm(user))
        } else {
            const Client = new node.NodeactylClient(settings.panelURL, row.token);
            Client.killServer(args[0]).then((response) => {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Server killed")
                    .setColor(settings.embed.color.default)
                    .setFooter(settings.embed.footer);
                message.channel.send(embed);
            }).catch((error) => {
                message.channel.send(client.embederror(error))
            });
        }
    });
}
module.exports.help = {
    name: "kill"
}

