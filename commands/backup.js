const Discord = require("discord.js")
const settings = require("../settings.json")
const node = require('ptero-api')
const sql = require("sqlite")
const p = settings.prefix
sql.open("./users.sqlite")
module.exports.run = (client, message, args) => {
    if (args.length !== 1) {
        message.channel.send(client.embederror(`Usage: ${p}backups <serverid>`))
        return;
    }
    sql.get(`SELECT * FROM users WHERE id = "${message.author.id}"`).then(row => {
        if (!row) {
            message.channel.send(client.noperm(user))
        } else {
            const Client = new node.NodeactylClient(settings.panelURL, row.token);
            Client.createServerBackup(args[0]).then((response) => {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Created ${response.name}`)
                    .setURL()
                    .setColor(settings.embed.color.default)
                    .setFooter(settings.embed.footer);
                message.channel.send(embed);
            }).catch((error) => {
                message.channel.send(client.embederror(error))
            });
        }

    })
}
module.exports.help = {
    name: "backup"
}

