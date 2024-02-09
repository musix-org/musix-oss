const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: 'settings',
  usage: '[setting]',
  description: 'Change the settings',
  alias: 'settings',
  cooldown: 10,
  async execute(message, args, client, prefix) {
    const embed = new EmbedBuilder()
      .setTitle('Guild settings for Musix')
      .addFields(
        { name: 'prefix', value: 'Change the guild specific prefix. (string)', inline: true},
        { name: 'volume', value: 'Change the default volume that the bot will start playing at. (number)', inline: true },
        { name: 'permissions', value: 'Change whether to require permissions to use eg `skip, stop, pause, loop, etc...`', inline: true },
        { name: 'setdj', value: 'Set a DJ role. This will allow chosen users to freely use all Musix commands. This will automatically set the `permissions` settings to true in order for the `DJ` role to have effect!', inline: true },
        { name: 'announcesongs', value: 'Whether to announce songs that start playing or not.' },
        { name: 'songselection', value: 'Will i ask to select a song from the top 10 queries or start playing the first result instantly.' }
      )
      .setFooter({ text: `how to use: ${prefix}settings <Setting name> <value>` })
      .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL()})
      .setColor(client.embedColor)
    const permissions = message.channel.permissionsFor(message.author);
    if (!permissions.has(PermissionFlagsBits.ManageGuild)) return message.channel.send(':x: You need the `MANAGE_SERVER` permission to change the settings!');
    if (args[1]) {
      const optionName = args[1].toLowerCase();
      const option = client.settingCmd.get(optionName) || client.settingCmd.find(cmd => cmd.aliases && cmd.aliases.includes(optionName));
      if (!option) return message.channel.send({ embeds: [embed] });
      try {
        option.execute(message, args, client, prefix);
      } catch (error) {
        message.reply(`:x: there was an error trying to execute that option!`);
        console.log(error);
      }
    } else {
      return message.channel.send({ embeds: [embed] });
    }
  },
};
