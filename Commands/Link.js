const Command = require("../Structures/Command");
const Discord = require("discord.js");
async function awaitReply(msg, question, limit = 60000) {
  const filter = (m) => m.author.id === msg.author.id;
  const qC = await msg.author.send(question);
  try {
    const collected = await qC.channel.awaitMessages(filter, {
      max: 1,
      time: limit,
      errors: ["time"],
    });
    return collected.first().content;
  } catch (e) {
    return false;
  }
}
module.exports = class Link extends Command.Command {
  constructor(client) {
    super(client, {
      name: "link",
      description: "Links you to the panel",
      usage: "staff",
    });
  }
  async exec(message, args) {
    let settings = await this.client.con.models.Guild.findOne({
        id: message.guild.id,
      });
      
      message.author.send
    }
};
