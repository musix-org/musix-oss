const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "settings",
  alias: ["options", "ops", "preferences"],
  usage: "<setting> <value(opt)>",
  description: "Change the server settings for Musix.",
  permission: "MANAGE_GUILD",
  category: "util",
  async execute(msg, args, client, command) {
    let footer;
    footer = client.messages.settingsFooter.replace(
      "%PREFIX%",
      client.global.db.guilds[msg.guild.id].prefix
    );
    const embed = new EmbedBuilder()
      .setTitle(client.messages.settingsTitle)
      .addFields(
        { name: client.messages.settingsPrefix, value: client.messages.settingsPrefixDesc, inline: true },
        { name: client.messages.settingsVolume, value: client.messages.settingsVolumeDesc, inline: true },
        { name: client.messages.settingsBlacklist, value: client.messages.settingsBlacklistDesc, inline: true },
        { name: client.messages.settingsPermissions, value: client.messages.settingsPermissionsDesc, inline: true },
        { name: client.messages.settingsSetDj, value: client.messages.settingsSetDjDesc, inline: true },
        { name: client.messages.settingsAnnounceSongs, value: client.messages.settingsAnnounceSongsDesc },
        { name: client.messages.settingsBass, value: client.messages.settingsBassDesc, inline: true },
        { name: client.messages.settingsAutoPlay, value: client.messages.settingsAutoPlayDesc, inline: true }
      )
      .setFooter({ text: footer })
      .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
      .setColor(client.config.embedColor);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (msg.author.id !== client.config.devId) {
      if (!permissions.has(command.permission))
        return msg.channel.send(client.messages.noPermsManageSettings);
    }
    if (args[1]) {
      const optionName = args[1].toLowerCase();
      const option =
        client.settingCmd.get(optionName) ||
        client.settingCmd.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(optionName)
        );
      if (!option) return msg.channel.send(embed);
      try {
        option.execute(msg, args, client);
      } catch (error) {
        msg.reply(client.messages.errorExeOpt);
        console.log(error.toString());
        console.log(error.stack.replace(/at /g, "**at **"));
      }
    } else {
      return msg.channel.send(embed);
    }
  },
};
