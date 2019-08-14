module.exports = {
  name: 'settings',
  usage: '[setting]',
  description: 'Change the settings',
  cooldown: 5,
  async execute(message, args, client, RichEmbed, prefix) {
    const permissions = message.channel.permissionsFor(message.author);
    if (message.author.id !== '360363051792203779') {
      if (!permissions.has('MANAGE_GUILD')) return message.channel.send(':x: You need the `MANAGE_SERVER` permission to change the settings!');
    }
    if (!args[1]) {
      const embed = new RichEmbed()
        .setTitle('Guild settings for Musix')
        .addField('prefix', 'Change the guild specific prefix.', true)
        .setFooter(`how to use: ${prefix}settings <Setting name> <value>`)
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor('#b50002')
      return message.channel.send(embed);
    }
    if (args[1] === 'prefix') {
      if (!args[2]) return message.channel.send(':x: You need to define the prefix!');
      if (args[2].length > 5) return message.channel.send(':x: The prefix must be less than or equal to 5 characters');
      await client.setPrefix(args[2], message.guild.id);
      message.channel.send(`:white_check_mark: New prefix set: \`${args[2]}\`\n${client.global.replies.fiveMinutes}`);
    }
  },
};