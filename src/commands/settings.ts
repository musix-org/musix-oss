module.exports = {
  name: 'settings',
  alias: 'pref',
  usage: '<setting> <value(opt)>',
  description: 'Change the server settings for Musix.',
  onlyDev: false,
  permission: 'MANAGE_GUILD',
  category: 'util',
  async execute(msg, args, client, Discord, command) {
    const embed = new Discord.MessageEmbed()
      .setTitle(client.messages.settingsTitle)
      .addField(client.messages.settingsPrefix, client.messages.settingsPrefixDesc, true)
      .addField(client.messages.settingsVolume, client.messages.settingsVolumeDesc, true)
      .addField(client.messages.settingsPermissions, client.messages.settingsPermissionsDesc, true)
      .addField(client.messages.settingsSetDj, client.messages.settingsSetDjDesc, true)
      .addField(client.messages.settingsAnnounceSongs, client.messages.settingsAnnounceSongsDesc)
      .addField(client.messages.settingsBass, client.messages.settingsBassDesc, true)
      .setFooter(client.messages.settingsFooter)
      .setAuthor(client.user.username, client.user.displayAvatarURL)
      .setColor(client.config.embedColor)
    const permissions = msg.channel.permissionsFor(msg.author);
    if (msg.author.id !== client.config.devId) {
      if (!permissions.has(command.permission)) return msg.channel.send(client.messages.noPermsManageSettings);
    }
    if (args[1]) {
      const optionName = args[1].toLowerCase();
      const option = client.settingCmd.get(optionName) || client.settingCmd.find(cmd => cmd.aliases && cmd.aliases.includes(optionName));
      if (!option) return msg.channel.send(embed);
      try {
        option.execute(msg, args, client);
      } catch (error) {
        msg.reply(client.messages.errorExeOpt);
        const embed = new Discord.MessageEmbed()
          .setTitle(`Musix ${error.toString()}`)
          .setDescription(error.stack.replace(/at /g, '**at **'))
          .setColor(client.config.embedColor);
        client.fetchUser(client.config.devId).then(user => user.send(embed)).catch(console.error);
        client.users.cache.get(client.config.devId).send(embed);
      }
    } else {
      return msg.channel.send(embed);
    }
  },
};
