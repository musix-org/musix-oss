module.exports = {
  name: 'settings',
  usage: '[setting]',
  description: 'Change the settings',
  alias: 'settings',
  cooldown: 10,
  onlyDev: false,
  async execute(message, args, client, Discord, prefix) {
    const embed = new Discord.RichEmbed()
      .setTitle('Guild settings for Musix')
      .addField('prefix', 'Change the guild specific prefix. (string)', true)
      .addField('volume', 'Change the default volume that the bot will start playing at. (number)', true)
      .addField('permissions', 'Change whether to require permissions to use eg `skip, stop, pause, loop, etc...`', true)
      .addField('setdj', 'Set a DJ role. This will allow chosen users to freely use all Musix commands. This will automatically set the `permissions` settings to true in order for the `DJ` role to have effect!', true)
      .addField('announcesongs', 'Whether to announce songs that start playing or not.')
      .addField('songselection', 'Will i ask to select a song from the top 10 queries or start playing the first result instantly.')
      .setFooter(`how to use: ${prefix}settings <Setting name> <value>`)
      .setAuthor(client.user.username, client.user.displayAvatarURL)
      .setColor('#b50002')
    const permissions = message.channel.permissionsFor(message.author);
    if (message.author.id !== client.config.dev) {
      if (!permissions.has('MANAGE_GUILD')) return message.channel.send(':x: You need the `MANAGE_SERVER` permission to change the settings!');
    }
    if (args[1]) {
      const optionName = args[1].toLowerCase();
      const option = client.settingCmd.get(optionName) || client.settingCmd.find(cmd => cmd.aliases && cmd.aliases.includes(optionName));
      if (!option) return message.channel.send(embed);
      try {
        option.execute(message, args, client, Discord, prefix);
      } catch (error) {
        message.reply(`:x: there was an error trying to execute that option! Please contact support with \`${prefix}bug\`!`);
        const embed = new Discord.RichEmbed()
          .setTitle(`Musix ${error.toString()}`)
          .setDescription(error.stack.replace(/at /g, '**at **'))
          .setColor('#b50002');
        client.fetchUser(client.config.devId).then(user => user.send(embed)).catch(console.error);
        client.channels.get(client.config.debug_channel).send(embed);
      }
    } else {
      return message.channel.send(embed);
    }
  },
};
