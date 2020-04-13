module.exports = async function (
  video,
  msg,
  voiceChannel,
  client,
  playlist = false
) {
  const Discord = require("discord.js");
  const song = {
    title: Discord.Util.escapeMarkdown(video.title),
    url: video.url,
    author: msg.author,
  };

  const queue = client.queue.get(msg.guild.id);

  if (queue) {
    queue.songs.push(song);
    if (playlist) return;
    let message;
    message = client.messages.songAdded.replace("%TITLE%", song.title);
    return msg.channel.send(message);
  }

  const construct = {
    textChannel: null,
    voiceChannel: null,
    connection: null,
    songs: [],
    volume: null,
    bass: null,
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

  construct.textChannel = msg.channel;
  construct.voiceChannel = voiceChannel;
  construct.volume = client.global.db.guilds[msg.guild.id].defaultVolume;
  construct.bass = client.global.db.guilds[msg.guild.id].bass;

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
