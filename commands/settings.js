module.exports = {
  name: 'settings',
  usage: '[setting]',
  description: 'Change the settings',
  cooldown: 10,
  async execute(message, args, client, Discord, prefix) {
    const permissions = message.channel.permissionsFor(message.author);
    if (message.author.id !== '360363051792203779') {
      if (!permissions.has('MANAGE_GUILD')) return message.channel.send(':x: You need the `MANAGE_SERVER` permission to change the settings!');
    }
    if (args[1] === 'prefix') {
      if (!args[2]) return message.channel.send(`<:thonk:461691390972264449> Current prefix: \`${client.global.db.guilds[message.guild.id].prefix}\``);
      client.global.db.guilds[message.guild.id].prefix = args[2];
      message.channel.send(`:white_check_mark: New prefix set to: \`${args[2]}\``);
    } else if (args[1] === 'volume') {
      if (!args[2]) return message.channel.send(`:speaker: Current default volume is: \`${client.global.db.guilds[message.guild.id].defaultVolume}\``);
      if (isNaN(args[2])) return message.channel.send(':x: I\'m sorry, But the default volume needs to be a valid __number__.');
      if (args[2].length > 2) return message.channel.send(':x: The default volume must be below `100` for quality and safety resons.');
      client.global.db.guilds[message.guild.id].defaultVolume = args[2];
      message.channel.send(`:white_check_mark: Default volume set to: \`${args[2]}\``);
    } else if (args[1] === 'permissions') {
      if (!args[2]) return message.channel.send(`🔒 Permission requirement: \`${client.global.db.guilds[message.guild.id].permissions}\``);
      if (args[2] === 'true') {
        if (client.global.db.guilds[message.guild.id].permissions === false) {
          client.global.db.guilds[message.guild.id].permissions = true;
          message.channel.send(`:white_check_mark: Permissions requirement now set to: \`true\``);
        } else return message.channel.send(':x: That value is already `true`!');
      } else if (args[2] === 'false') {
        if (client.global.db.guilds[message.guild.id].permissions === true) {
          client.global.db.guilds[message.guild.id].permissions = false;
          message.channel.send(`:white_check_mark: Permissions requirement now set to: \`false\``);
        } else return message.channel.send(':x: That value is already `false`!');
      } else return message.channel.send(':x: Please define a boolean! (true/false)');
    } else if (args[1] === 'setPremium' && message.author.id === '360363051792203779') {
      if (args[2]) {
        const guild = client.guilds.get(args[2]);
        if (!client.global.db.guilds[guild.id].premium) {
          client.global.db.playlists[guild.id] = {
            songs: [],
            firstSong: undefined,
            saved: false,
          };
          client.global.db.guilds[guild.id].premium = true;
          message.channel.send(`:white_check_mark: Guild ${guild.name} | ${guild.id} is now premium! :party~1:`)
        } else {
          client.global.db.guilds[guild.id].premium = false;
          message.channel.send(`:white_check_mark: Guild ${guild.name} | ${guild.id} is no longer premium!`)
        }
      } else {
        if (!client.global.db.guilds[message.guild.id].premium) {
          client.global.db.playlists[message.guild.id] = {
            songs: [],
            firstSong: undefined,
            saved: false,
          };
          client.global.db.guilds[message.guild.id].premium = true;
          message.channel.send(':white_check_mark: This guild is now premium! :party~1:')
        } else {
          client.global.db.guilds[message.guild.id].premium = false;
          message.channel.send(":white_check_mark: This guild is no longer premium!")
        }
      }
    } else {
      const embed = new Discord.RichEmbed()
        .setTitle('Guild settings for Musix')
        .addField('prefix', 'Change the guild specific prefix.', true)
        .addField('volume', 'Change the default volume that the bot will start playing at.', true)
        .addField('permissions', 'Change whether to require permissions to use eg `skip, stop, pause, loop, etc...`')
        .setFooter(`how to use: ${prefix}settings <Setting name> <value>`)
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor('#b50002')
      return message.channel.send(embed);
    }
  },
};
