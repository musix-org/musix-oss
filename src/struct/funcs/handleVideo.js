module.exports = async function (
  resource,
  msg,
  voiceChannel,
  client,
  playlist,
  type
) {
  const Discord = require("discord.js");
  const song = {
    title: Discord.Util.escapeMarkdown(resource.title),
    url: resource.url,
    author: msg.author,
    type: type,
  };

  const queue = client.queue.get(msg.guild.id);

  if (queue) {
    queue.songs.push(song);
    queue.textChannel = msg.channel;
    if (playlist) return;
    let message;
    message = client.messages.songAdded.replace("%TITLE%", song.title);
    return msg.channel.send(message);
  }

  const construct = {
    textChannel: msg.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: client.global.db.guilds[msg.guild.id].defaultVolume,
    bass: client.global.db.guilds[msg.guild.id].bass,
    nigthCore: false,
    playing: false,
    paused: false,
    looping: false,
    songLooping: false,
    votes: 0,
    voters: [],
    votesNeeded: null,
    time: 0,
    endReason: null,
  };

  construct.songs.push(song);

  client.queue.set(msg.guild.id, construct);

  try {
    const connection = await voiceChannel.join();
    construct.connection = connection;
    client.funcs.play(msg.guild, construct.songs[0], client, 0, true);
  } catch (error) {
    client.queue.delete(msg.guild.id);
    client.users.cache
      .get(client.config.devId)
      .send(client.messages.errorConnecting + error);
    return msg.channel.send(client.messages.error);
  }
  return;
};