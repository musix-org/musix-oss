const YouTube = require("simple-youtube-api");
const SpotifyApi = require("spotify-web-api-node");
const search = require("yt-search");
const ytdl = require("ytdl-core")

module.exports = {
  name: "play",
  alias: "p",
  usage: "<song name>",
  description: "Play some music.",
  onlyDev: false,
  permission: "none",
  category: "music",
  async execute(msg, args, client, Discord, command) {
    const spotify = new SpotifyApi({
      id: client.config.spotify_client_id,
      secret: client.config.spotify_client_secret,
    });
    spotify.setAccessToken(client.config.spotify_access_key);

    const youtube = new YouTube(client.config.api_key);
    const searchString = args.slice(1).join(" ");
    const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
    const queue = client.queue.get(msg.guild.id);
    const voiceChannel = msg.member.voice.channel;
    if (
      client.global.db.guilds[msg.guild.id].blacklist.includes(
        msg.member.voice.channelID
      )
    )
      return msg.channel.send(client.messages.blackListedVC);
    if (!queue) {
      if (!msg.member.voice.channel)
        return msg.channel.send(client.messages.noVoiceChannel);
    } else {
      if (voiceChannel !== queue.voiceChannel)
        return msg.channel.send(client.messages.wrongVoiceChannel);
    }
    if (!args[1]) return msg.channel.send(client.messages.noQuery);
    if (voiceChannel.full) return msg.channel.send(client.messages.channelFull);
    if (!voiceChannel.joinable)
      return msg.channel.send(client.messages.noPermsConnect);
    if (!voiceChannel.speakable)
      return msg.channel.send(client.messages.noPermsSpeak);
    if (ytdl.validateURL(url)) {
      const song = await ytdl.getInfo(url);
      const resource = {
        title: song.title,
        url: url
      }
      client.funcs.handleVideo(
        resource,
        msg,
        voiceChannel,
        client,
        true,
        "ytdl"
      );
    } else if (url.match(/^https?:\/\/(open.spotify.com|spotify.com)(.*)$/)) {
      const playlistId = url.split("/playlist/")[1].split("?")[0];
      spotify.getPlaylist(playlistId).then(
        async function (data) {
            searchVideos(data, client, msg, voiceChannel)
          },
          function (err) {
            console.log(err);
            msg.channel.send(client.messages.noResultsSpotify);
          });
    } else if (
      url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)
    ) {
      const lmsg = await msg.channel.send(client.messages.loadingSongs);
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id);
        await client.funcs.handleVideo(
          video2,
          msg,
          voiceChannel,
          client,
          true,
          "ytdl"
        );
      }
      let message;
      message = client.messages.playlistAdded.replace(
        "%TITLE%",
        playlist.title
      );
      return lmsg.edit(message);
    } else {
      ytSearch(searchString, function (err, res) {
        if (err) return console.log(err);
        if (res.videos.length === 0)
          return msg.channel.send(client.messages.noResults);
        client.funcs.handleVideo(
          res.videos[0],
          msg,
          voiceChannel,
          client,
          false,
          "ytdl"
        );
      });
    }
  },
};

async function searchVideos(data, client, msg, voiceChannel) {
  const lmsg = await msg.channel.send(client.messages.loadingSongs);
  let failed = 0;
  for (let i = 0; data.body.tracks.items.length > i; i++) {
    const track = await data.body.tracks.items[i].track;
    await client.funcs.sleep(250);
    await search(
      `${track.artists[0].name} ${track.name} audio`,
      async function (err, res) {
        if (err) return console.log(err);
        if (res.videos.length === 0) {
          await search(
            `${track.artists[0].name} ${track.name} lyrics`,
            async function (err, res) {
              if (err) return console.log(err);
              if (res.videos.length === 0) {
                await search(
                  `${track.artists[0].name} ${track.name}`,
                  async function (err, res) {
                    if (err) return console.log(err);
                    if (res.videos.length === 0) {
                      failed++;
                      return;
                    }
                    await client.funcs.handleVideo(
                      res.videos[0],
                      msg,
                      voiceChannel,
                      client,
                      true,
                      "ytdl"
                    );
                  }
                );
                return;
              }
              await client.funcs.handleVideo(
                res.videos[0],
                msg,
                voiceChannel,
                client,
                true,
                "ytdl"
              );
            }
          );
          failed++;
          return;
        }
        await client.funcs.handleVideo(
          res.videos[0],
          msg,
          voiceChannel,
          client,
          true,
          "ytdl"
        );
      }
    );
  }
  let message;
  if (failed === 0) {
    message = client.messages.playlistAdded.replace(
      "%TITLE%",
      data.body.name
    );
  } else {
    message = `${client.messages.playlistAdded.replace(
              "%TITLE%",
              data.body.name
            )}\n${client.messages.failedToLoad + failed}`;
  }
  lmsg.edit(message);
}