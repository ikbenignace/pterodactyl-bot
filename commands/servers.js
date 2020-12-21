const Discord = require("discord.js")
const settings = require("../settings.json")
const node = require('ptero-api')
const sql = require("sqlite")
sql.open("./users.sqlite")
module.exports.run = (client, message, args) => {
    let user;
    if (args.length > 0) {
        user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    sql.get(`SELECT * FROM users WHERE id = "${user.id}"`).then(row => {
        if (!row) {
            const error = `The user whose servers you requested is not registered.`
            message.channel.send(client.embederror(error))
        } else {
            const Client = new node.NodeactylClient(settings.panelURL, row.token);
            const servers = new Discord.MessageEmbed()
                .setColor(settings.embed.color.default)
                .setTitle(`${user.username}'s Servers`)
                .setTimestamp()
                .setFooter(settings.embed.footer);

            Client.getAllServers().then(async response => {
                let data = response.data;
                const usages = await Promise.all(data.map(element => Client.getServerUsages(element.attributes.identifier)));
                data.forEach((element, id) => {
                    let usage = usages[id]
                    servers.addField(
                        `**${element.attributes.name}**`,
                        `**Id**: [${element.attributes.identifier}](https://panel.mcserver.be/server/${element.attributes.identifier})\n**RAM**: ${Math.round(usage.resources.memory_bytes * 9.537e-7)}/${element.attributes.limits.memory}MB\n**CPU Usage**: ${usage.resources.cpu_absolute}%\n**Disk Usage**: ${Math.round(usage.resources.disk_bytes * 9.537e-7)}MB\n**Node**: ${element.attributes.node}\n**Status**: ${usage.current_state}\n**IP**: ${element.attributes.relationships.allocations.data[0].attributes.ip}:${element.attributes.relationships.allocations.data[0].attributes.port}`, true)
                })
                await message.channel.send(servers);

            }).catch(error => {
                message.channel.send(client.embederror(error))
            })


        }
    })

}
module.exports.help = {
    name: "servers"
}

