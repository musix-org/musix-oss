const {
  Readable: ReadableStream
} = require("stream");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const {
  streamConfig
} = require("../config/config.js");
const prism = require("prism-media");

module.exports = async function (guild, song, client, seek, play) {
  const queue = client.queue.get(guild.id);
  if (!song) {
    queue.voiceChannel.leave();
    queue.exists = false;
    client.queue.delete(guild.id);
    return;
  }
  setTimeout(() => {
    if (!queue.playing && queue.exists) {
      queue.textChannel.send(client.messages.tookTooLong);
      queue.voiceChannel.leave();
      client.queue.delete(guild.id);
      return;
    }
  }, 30000);

  streamConfig.options.seek = seek;

  let input = song.url;
  if (song.type === "ytdl" || song.type === "spotify")
    input = ytdl(song.url, streamConfig.ytdlOptions)
    //.on('info', (info, format) => console.log(format))
    .on("error", (error) => console.log(error));

  const ffmpegArgs = [
    "-analyzeduration",
    "0",
    "-loglevel",
    "0",
    "-f",
    "s16le",
    "-ar",
    "48000",
    "-ac",
    "2",
    "-af",
    `bass=g=${queue.bass}`,
  ];
  client.funcs.sleep(500);
  if (queue.nightCore) {
    ffmpegArgs.push("-af");
    ffmpegArgs.push("asetrate=52920");
  }

  const isStream = input instanceof ReadableStream;

  const args = isStream ? ffmpegArgs.slice() : ["-i", input, ...ffmpegArgs];
  args.unshift("-ss", String(seek));

  const transcoder = new prism.FFmpeg({
    args: args,
  });

  const stream = input.pipe(transcoder).on("error", (error) => {
    console.log(error);
  });

  const dispatcher = queue.connection.play(stream, streamConfig.options)
  dispatcher.setVolume(queue.volume / 100);
  require("../../events/dispatcherEvents/handler")(client, dispatcher, queue, guild);
  if ((client.global.db.guilds[guild.id].startPlaying && play) || play) {
    if (song.type !== "ytdl" && song.type !== "spotify") return;
    const embed = new Discord.MessageEmbed()
      .setTitle(`${client.messages.startPlaying}**${song.title}**`)
      .setDescription(
        `Song duration: \`${client.funcs.msToTime(
          queue.songs[0].info.lengthSeconds * 1000,
          "hh:mm:ss"
        )}\``
      )
      .setColor(client.config.embedColor);
    queue.textChannel.send(embed);
  }
  queue.playing = true;
};