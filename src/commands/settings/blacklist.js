const discord = require("discord.js");

module.exports = {
  name: "blacklist",
  async execute(msg, args, client) {
    let embed;
    switch (args[2]) {
      case "add":
        if (msg.mentions.channels.first()) {
          if (
            client.global.db.guilds[msg.guild.id].blacklist.includes(
              msg.mentions.channels.first().id
            )
          )
            return msg.channel.send(client.messages.channelAlreadyBlackListed);
        } else if (
          client.global.db.guilds[msg.guild.id].blacklist.includes(args[3])
        )
          return msg.channel.send(client.messages.channelAlreadyBlackListed);
        if (
          !msg.guild.channels.cache.get(args[3]) &&
          !msg.mentions.channels.first()
        )
          return msg.channel.send(client.messages.idOrMentionChannel);
        if (msg.mentions.channels.first()) {
          client.global.db.guilds[msg.guild.id].blacklist.push(
            msg.mentions.channels.first().id
          );
          let message;
          message = client.messages.channelAdded.replace(
            "%CHANNEL%",
            msg.mentions.channels.first().name
          );
          msg.channel.send(message);
        } else {
          client.global.db.guilds[msg.guild.id].blacklist.push(args[3]);
          let message;
          message = client.messages.channelAdded.replace(
            "%CHANNEL%",
            msg.guild.channels.cache.get(args[3]).name
          );
          msg.channel.send(message);
        }
        break;
      case "remove":
        if (msg.mentions.channels.first()) {
          if (
            !client.global.db.guilds[msg.guild.id].blacklist.includes(
              msg.mentions.channels.first().id
            )
          )
            return msg.channel.send(client.messages.channelNotBlackListed);
          if (
            client.global.db.guilds[msg.guild.id].blacklist.indexOf(
              msg.mentions.channels.first().id
            ) !== -1
          ) {
            client.global.db.guilds[msg.guild.id].blacklist.splice(
              client.global.db.guilds[msg.guild.id].blacklist.indexOf(
                msg.mentions.channels.first().id
              ),
              1
            );
            let message;
            message = client.messages.channelRemoved.replace(
              "%CHANNEL%",
              msg.mentions.channels.first().name
            );
            msg.channel.send(message);
          }
        } else {
          if (!client.global.db.guilds[msg.guild.id].blacklist.includes(args[3]))
            return msg.channel.send(client.messages.channelNotBlackListed);
          if (
            client.global.db.guilds[msg.guild.id].blacklist.indexOf(args[3]) !==
            -1
          ) {
            client.global.db.guilds[msg.guild.id].blacklist.splice(
              client.global.db.guilds[msg.guild.id].blacklist.indexOf(args[3]),
              1
            );
            let message;
            message = client.messages.channelRemoved.replace(
              "%CHANNEL%",
              msg.guild.channels.cache.get(args[3]).name
            );
            msg.channel.send(message);
          }
        }
        break;
      case "list":
        embed = new discord.MessageEmbed()
          .setTitle(client.messages.blacklistTitle)
          .setDescription(
            `${client.global.db.guilds[msg.guild.id].blacklist
            .map((c) => `**-** <#${c}>`)
            .join("\n")}`
          )
          .setColor(client.config.embedColor);
        msg.channel.send(embed);
        break;
      case undefined:
        embed = new discord.MessageEmbed()
          .setTitle(client.messages.blacklistTitle)
          .addField("add", "Add a channel to the blacklist. (ID or mention)")
          .addField(
            "remove",
            "Remove a channel from the blacklist. (ID or mention)"
          )
          .addField("list", "List the currently blacklisted channels.")
          .setColor(client.config.embedColor);
        msg.channel.send(embed);
        break;
    }
  },
};