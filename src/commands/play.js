const ytdl = require("ytdl-core");
const ytsr = require("ytsr");

module.exports = {
  name: "play",
  alias: ["p", "music"],
  usage: "<song name>",
  description: "Play some music.",
  onlyDev: false,
  permission: "none",
  category: "play",
  async execute(msg, args, client, Discord, command) {
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
      client.funcs.handleVideo(url, msg, voiceChannel, client, false, "ytdl");
    } else if (url.match(/^https?:\/\/(open.spotify.com|spotify.com)(.*)$/)) {
      if (url.includes("playlist")) {
        const playlistId = url.split("/playlist/")[1].split("?")[0];
        client.spotify.getPlaylist(playlistId).then(
          async function (data) {
              searchPlaylist(data, client, msg, voiceChannel);
            },
            function (err) {
              console.log(err);
              msg.channel.send(client.messages.noResultsSpotify);
            }
        );
      } else if (url.includes("album")) {
        const albumId = url.split("/album/")[1].split("?")[0];
        client.spotify.getAlbumTracks(albumId).then(
          async function (data) {
              searchAlbum(data, client, msg, voiceChannel);
            },
            function (err) {
              console.log(err);
              msg.channel.send(client.messages.noResultsSpotify);
            }
        );
      } else if (url.includes("track")) {
        return msg.channel.send(client.messages.disabledSpotifySongs);
        /*const trackId = url.split("/track/")[1].split("?")[0];
        spotify.searchTracks(trackId)
          .then(function (data) {
            console.log(data.body)
          }, function (err) {
            console.log('Something went wrong!', err);
          });*/
      } else msg.channel.send(client.messages.invalidSpotifyUrl);
    } else if (
      url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)
    ) {
      const lmsg = await msg.channel.send(client.messages.loadingSongs);
      const playlist = await client.youtube.getPlaylist(url).catch((err) => {
        console.log("err1");
      });
      const videos = await playlist.getVideos().catch((err) => {
        console.log("err2");
      });
      for (const video of Object.values(videos)) {
        const video2 = await client.youtube.getVideoByID(video.id).catch((err) => {
          console.log("err3");
        });
        client.spotify.searchTracks(`track:${video2.name}`).then(
          function (data) {
            client.funcs.handleVideo(
              video2.url,
              msg,
              voiceChannel,
              client,
              true,
              "ytdl",
              data.body.tracks.items[0]
            );
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
      }
      const message = client.messages.playlistAdded.replace(
        "%TITLE%",
        playlist.title
      );
      return lmsg.edit(message);
    } else {
      ytsr(
        searchString, {
          limit: 5,
        },
        function (err, res) {
          if (err) console.log(err);
          if (!res.items[0]) return msg.channel.send(client.messages.noResults);
          const videoResults = res.items.filter(
            (item) => item.type === "video"
          );
          client.spotify.searchTracks(`track:${searchString}`).then(
            function (data) {
              client.funcs.handleVideo(
                videoResults[0].link,
                msg,
                voiceChannel,
                client,
                false,
                "ytdl",
                data.body.tracks.items[0]
              );
            },
            function (err) {
              console.log(err);
            }
          );
        }
      );
    }
  },
};

async function searchPlaylist(data, client, msg, voiceChannel) {
  const lmsg = await msg.channel.send(client.messages.loadingSongs);
  let failed = 0;
  for (let i = 0; data.body.tracks.items.length > i; i++) {
    const track = await data.body.tracks.items[i].track;
    await client.funcs.sleep(250);
    ytsr(
      `${track.artists[0].name} ${track.name} audio`, {
        limit: 5,
      },
      async function (err, res) {
        if (err) return console.log(err);
        if (!res.items[0]) {
          ytsr(
            `${track.artists[0].name} ${track.name} lyrics`, {
              limit: 5,
            },
            async function (err, res) {
              if (err) return console.log(err);
              if (!res.items[0]) {
                ytsr(
                  `${track.artists[0].name} ${track.name}`, {
                    limit: 5,
                  },
                  async function (err, res) {
                    if (err) console.log(err);
                    if (!res.items[0]) {
                      failed++;
                    }
                    const videoResults = res.items.filter(
                      (item) => item.type === "video"
                    );
                    client.funcs.handleVideo(
                      videoResults[0].link,
                      msg,
                      voiceChannel,
                      client,
                      false,
                      "spotify",
                      track
                    );
                  }
                );
                return;
              }
              const videoResults = res.items.filter(
                (item) => item.type === "video"
              );
              await client.funcs.handleVideo(
                videoResults[0].link,
                msg,
                voiceChannel,
                client,
                true,
                "spotify",
                track
              );
            }
          );
          failed++;
          return;
        }
        const videoResults = res.items.filter((item) => item.type === "video");
        await client.funcs.handleVideo(
          videoResults[0].link,
          msg,
          voiceChannel,
          client,
          true,
          "spotify",
          track
        );
      }
    );
  }
  let message;
  if (failed === 0) {
    message = client.messages.playlistAdded.replace("%TITLE%", data.body.name);
  } else {
    message = `${client.messages.playlistAdded.replace(
      "%TITLE%",
      data.body.name
    )}\n${client.messages.failedToLoad + failed}`;
  }
  lmsg.edit(message);
}

async function searchAlbum(data, client, msg, voiceChannel) {
  const lmsg = await msg.channel.send(client.messages.loadingSongs);
  let failed = 0;
  for (let i = 0; data.body.items.length > i; i++) {
    const track = await data.body.items[i];
    await client.funcs.sleep(250);
    ytsr(
      `${track.artists[0].name} ${track.name} audio`, {
        limit: 5,
      },
      async function (err, res) {
        if (err) return console.log(err);
        if (!res.items[0]) {
          ytsr(
            `${track.artists[0].name} ${track.name} lyrics`, {
              limit: 5,
            },
            async function (err, res) {
              if (err) return console.log(err);
              if (!res.items[0]) {
                ytsr(
                  `${track.artists[0].name} ${track.name}`, {
                    limit: 5,
                  },
                  async function (err, res) {
                    if (err) console.log(err);
                    if (!res.items[0]) {
                      failed++;
                    }
                    const videoResults = res.items.filter(
                      (item) => item.type === "video"
                    );
                    client.funcs.handleVideo(
                      videoResults[0].link,
                      msg,
                      voiceChannel,
                      client,
                      false,
                      "spotify",
                      track
                    );
                  }
                );
                return;
              }
              const videoResults = res.items.filter(
                (item) => item.type === "video"
              );
              await client.funcs.handleVideo(
                videoResults[0].link,
                msg,
                voiceChannel,
                client,
                true,
                "spotify",
                track
              );
            }
          );
          failed++;
          return;
        }
        const videoResults = res.items.filter((item) => item.type === "video");
        await client.funcs.handleVideo(
          videoResults[0].link,
          msg,
          voiceChannel,
          client,
          true,
          "spotify",
          track
        );
      }
    );
  }
  let message;
  if (failed === 0) {
    message = client.messages.albumAdded.replace(
      "%TITLE%",
      "yes taht palylist"
    );
  } else {
    message = `${client.messages.albumAdded.replace(
      "%TITLE%",
      "yes taht palylist"
    )}\n${client.messages.failedToLoad + failed}`;
  }
  lmsg.edit(message);
}

async function searchSong(data, client, msg, voiceChannel) {
  const lmsg = await msg.channel.send(client.messages.loadingSongs);
  let failed = 0;
  for (let i = 0; data.body.tracks.items.length > i; i++) {
    const track = await data.body.tracks.items[i].track;
    await client.funcs.sleep(250);
    ytsr(
      `${track.artists[0].name} ${track.name} audio`, {
        limit: 5,
      },
      async function (err, res) {
        if (err) return console.log(err);
        if (!res.items[0]) {
          ytsr(
            `${track.artists[0].name} ${track.name} lyrics`, {
              limit: 5,
            },
            async function (err, res) {
              if (err) return console.log(err);
              if (!res.items[0]) {
                ytsr(
                  `${track.artists[0].name} ${track.name}`, {
                    limit: 5,
                  },
                  async function (err, res) {
                    if (err) console.log(err);
                    if (!res.items[0]) {
                      failed++;
                    }
                    const videoResults = res.items.filter(
                      (item) => item.type === "video"
                    );
                    client.funcs.handleVideo(
                      videoResults[0].link,
                      msg,
                      voiceChannel,
                      client,
                      false,
                      "spotify",
                      track
                    );
                  }
                );
                return;
              }
              const videoResults = res.items.filter(
                (item) => item.type === "video"
              );
              await client.funcs.handleVideo(
                videoResults[0].link,
                msg,
                voiceChannel,
                client,
                true,
                "spotify",
                track
              );
            }
          );
          failed++;
          return;
        }
        const videoResults = res.items.filter((item) => item.type === "video");
        await client.funcs.handleVideo(
          videoResults[0].link,
          msg,
          voiceChannel,
          client,
          true,
          "spotify",
          track
        );
      }
    );
  }
  let message;
  if (failed === 0) {
    message = client.messages.playlistAdded.replace("%TITLE%", data.body.name);
  } else {
    message = `${client.messages.playlistAdded.replace(
      "%TITLE%",
      data.body.name
    )}\n${client.messages.failedToLoad + failed}`;
  }
  lmsg.edit(message);
}