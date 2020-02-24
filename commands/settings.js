module.exports = {
  name: 'settings',
  alias: 'pref',
  usage: '<setting> <value(opt)>',
  description: 'Change the server settings for Musix.',
  onlyDev: false,
  permission: 'MANAGE_GUILD',
  category: 'util',
  async execute(msg, args, client, Discord, prefix, command) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Guild settings for Musix')
      .addField('prefix', 'Change the guild specific prefix. (string)', true)
      .addField('volume', 'Change the default volume that the bot will start playing at. (number)', true)
      .addField('permissions', 'Change whether to require permissions to use eg `skip, stop, pause, loop, etc...`', true)
      .addField('setdj', 'Set a DJ role. This will allow chosen users to freely use all Musix commands. This will automatically set the `permissions` settings to true in order for the `DJ` role to have effect!', true)
      .addField('announcesongs', 'Whether to announce songs that start playing or not.')
      .setFooter(`how to use: ${prefix}settings <Setting name> <value>`)
      .setAuthor(client.user.username, client.user.displayAvatarURL)
      .setColor(client.embedColor)
    const permissions = msg.channel.permissionsFor(msg.author);
    if (msg.author.id !== client.config.devId) {
      if (!permissions.has(command.permission)) return msg.channel.send('<:redx:674263474704220182> You need the `MANAGE_SERVER` permission to change the settings!');
    }
    if (args[1]) {
      const optionName = args[1].toLowerCase();
      const option = client.settingCmd.get(optionName) || client.settingCmd.find(cmd => cmd.aliases && cmd.aliases.includes(optionName));
      if (!option) return msg.channel.send(embed);
      try {
        option.execute(msg, args, client, Discord, prefix);
      } catch (error) {
        msg.reply(`<:redx:674263474704220182> there was an error trying to execute that option! Please contact support with \`${prefix}bug\`!`);
        const embed = new Discord.MessageEmbed()
          .setTitle(`Musix ${error.toString()}`)
          .setDescription(error.stack.replace(/at /g, '**at **'))
          .setColor(client.config.embedColor);
        client.fetchUser(client.config.devId).then(user => user.send(embed)).catch(console.error);
        client.channels.get(client.config.debug_channel).send(embed);
      }
    } else {
      return msg.channel.send(embed);
    }
  },
};
