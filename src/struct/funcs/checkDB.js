module.exports = async function (client) {
  client.guilds.cache.forEach((guild) => {
    if (!client.global.db.guilds[guild.id]) {
      client.db.collection("guilds").doc(guild.id).set({
        prefix: client.config.prefix,
        defaultVolume: client.config.defaultVolume,
        permissions: client.config.permissions,
        dj: client.config.dj,
        djrole: client.config.djrole,
        startPlaying: client.config.startPlaying,
        bass: client.config.bass,
        blacklist: [],
        premium: false,
      });
      client.global.db.guilds[guild.id] = {
        prefix: client.config.prefix,
        defaultVolume: client.config.defaultVolume,
        permissions: client.config.permissions,
        dj: client.config.dj,
        djrole: client.config.djrole,
        startPlaying: client.config.startPlaying,
        bass: client.config.bass,
        blacklist: [],
        premium: false,
      };
      return;
    }
    if (client.global.db.guilds[guild.id].prefix === undefined)
      client.global.db.guilds[guild.id].prefix = client.config.prefix;
    if (client.global.db.guilds[guild.id].defaultVolume === undefined)
      client.global.db.guilds[guild.id].defaultVolume =
      client.config.defaultVolume;
    if (client.global.db.guilds[guild.id].permissions === undefined)
      client.global.db.guilds[guild.id].permissions = client.config.permissions;
    if (client.global.db.guilds[guild.id].dj === undefined)
      client.global.db.guilds[guild.id].dj = client.config.dj;
    if (client.global.db.guilds[guild.id].djrole === undefined)
      client.global.db.guilds[guild.id].djrole = client.config.djrole;
    if (client.global.db.guilds[guild.id].startPlaying === undefined)
      client.global.db.guilds[guild.id].startPlaying =
      client.config.startPlaying;
    if (client.global.db.guilds[guild.id].bass === undefined)
      client.global.db.guilds[guild.id].bass = client.config.bass;
    if (client.global.db.guilds[guild.id].blacklsit === undefined)
      client.global.db.guilds[guild.id].blacklist = [];
    if (client.global.db.guilds[guild.id].premium === undefined)
      client.global.db.guilds[guild.id].premium = false;
  });
};