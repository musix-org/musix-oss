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
        if (!client.global.db.guilds[message.guild.id].permissions) {
          client.global.db.guilds[message.guild.id].permissions = true;
          message.channel.send(`:white_check_mark: Permissions requirement now set to: \`true\``);
        } else return message.channel.send(':x: That value is already `true`!');
      } else if (args[2] === 'false') {
        if (client.global.db.guilds[message.guild.id].permissions) {
          client.global.db.guilds[message.guild.id].permissions = false;
          message.channel.send(`:white_check_mark: Permissions requirement now set to: \`false\``);
        } else return message.channel.send(':x: That value is already `false`!');
      } else return message.channel.send(':x: Please define a boolean! (true/false)');
    } else if (args[1] === 'setpremium' && message.author.id === '360363051792203779') {
      if (args[2]) {
        const guild = client.guilds.get(args[2]);
        if (!client.global.db.guilds[guild.id].premium) {
          client.global.db.playlists[guild.id] = {
            songs: [],
            firstSong: undefined,
            saved: false,
          };
          client.global.db.guilds[guild.id].premium = true;
          message.channel.send(`:white_check_mark: Guild ${guild.name} | ${guild.id} is now premium! :tada:`)
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
          message.channel.send(':white_check_mark: This guild is now premium! :tada:')
        } else {
          client.global.db.guilds[message.guild.id].premium = false;
          message.channel.send(":white_check_mark: This guild is no longer premium!")
        }
      }
    } else if (args[1] === "setdj") {
      if (!client.global.db.guilds[message.guild.id].dj) {
        if (!client.global.db.guilds[message.guild.id].permissions) {
          client.global.db.guilds[message.guild.id].permissions = true;
        }
        client.global.db.guilds[message.guild.id].dj = true;
        if (message.guild.roles.find(x => x.name === "DJ")) {
          client.global.db.guilds[message.guild.id].djrole = message.guild.roles.find(x => x.name === "DJ").id;
          message.channel.send(':white_check_mark: I found a `DJ` role from this guild! This role is now the DJ role.');
        } else {
          const permissions = message.channel.permissionsFor(message.client.user);
          if (!permissions.has('MANAGE_ROLES')) return message.channel.send(':x: I cannot create roles (Manage roles), make sure I have the proper permissions! I will need this permission to create a `DJ` role since i did not find one!');
          message.guild.createRole({
            name: 'DJ',
          })
            .then(role => client.global.db.guilds[message.guild.id].djrole = role.id)
            .catch(console.error)
          message.channel.send(':white_check_mark: I did not find a role `DJ` so i have created one for you!');
        }
      } else {
        client.global.db.guilds[message.guild.id].dj = false;
        message.channel.send(':white_check_mark: `DJ` now set to `false`');
      }
    } else if (args[1] === 'announcesongs') {
      if (client.global.db.guilds[message.guild.id].startPlaying) {
        client.global.db.guilds[message.guild.id].startPlaying = false;
        return message.channel.send(':white_check_mark: announcesongs now set to `false`!');
      } else {
        client.global.db.guilds[message.guild.id].startPlaying = true;
        return message.channel.send(':white_check_mark: announcesongs now set to `true`!');
      }
    } else {
      const embed = new Discord.RichEmbed()
        .setTitle('Guild settings for Musix')
        .addField('prefix', 'Change the guild specific prefix. (string)', true)
        .addField('volume', 'Change the default volume that the bot will start playing at. (number)', true)
        .addField('permissions', 'Change whether to require permissions to use eg `skip, stop, pause, loop, etc...`', true)
        .addField('setdj', 'Set a DJ role. This will allow chosen users to freely use all Musix commands. This will automatically set the `permissions` settings to true in order for the `DJ` role to have effect!', true)
        .addField('announcesongs', 'Whether to announce songs that start playing or not.')
        .setFooter(`how to use: ${prefix}settings <Setting name> <value>`)
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor('#b50002')
      return message.channel.send(embed);
    }
  },
};
