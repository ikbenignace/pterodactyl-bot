const Discord = require("discord.js")
const settings = require("../settings.json")
const node = require('ptero-api')
const sql = require("sqlite")
const p = settings.prefix
sql.open("./users.sqlite")
module.exports.run = (client, message, args) => {
    const user = message.author.username
    if (args.length !== 1) {
        message.channel.send(client.embederror(`Usage: ${p}backups <serverid>`))
        return;
    }

    sql.get(`SELECT * FROM users WHERE id = "${message.author.id}"`).then(row => {
        if (!row) {
            message.channel.send(client.noperm(user))
        } else {
            const Client = new node.NodeactylClient(settings.panelURL, row.token);

            const backups = new Discord.MessageEmbed()
                .setColor(settings.embed.color.default)
                .setTitle(`${user}'s Server backups`)
                .setTimestamp()
                .setFooter(settings.embed.footer);

            Client.listServerBackups(args[0]).then(async response => {
                let data = response;
                const links = await Promise.all(data.map(element => Client.getBackupDownload(args[0], element.attributes.uuid)));
                data.forEach((element, id) => {
                    let link = links[id]
                    backups.addField(
                        `**${element.attributes.name}**`,
                        `**Size**: ${Math.round(element.attributes.bytes * 9.537e-7)}\nMB**Creating date**: ${element.attributes.created_at}\n**[Download](${link.url})**`, true)
                })
                await message.channel.send(backups);

            }).catch(err => {
                console.log(err)
            })
        }

    })
}
module.exports.help = {
    name: "backups"
}

