module.exports = {
  name: "seek",
  alias: ["none"],
  usage: "<point in song (seconds)>",
  description: "Seek to a specific point in the currently playing song.",
  onlyDev: false,
  permission: "MANAGE_MESSAGES",
  category: "music",
  async execute(msg, args, client, Discord, command) {
    const ytdl = require("ytdl-core");
    const queue = client.queue.get(msg.guild.id);
    if (client.funcs.check(client, msg, command)) {
      if (queue.nigthCore)
        return msg.channel.send(client.messages.disableNigthCore);
      let data = await Promise.resolve(ytdl.getInfo(queue.songs[0].url));
      if (!args[1])
        return msg.channel.send(
          `${client.messages.correctUsage}\`${
            client.global.db.guilds[msg.guild.id].prefix
          }seek ${command.usage}\``
        );
      const pos = parseInt(args[1]);
      if (isNaN(pos)) {
        if (pos < 0)
          return msg.channel.send(client.messages.seekingPointPositive);
        let message;
        message = client.messages.seekMax.replace(
          "%LENGTH%",
          data.videoDetails.lengthSeconds
        );
        if (pos > data.videoDetais.lengthSeconds) return msg.channel.send(message);
      }
      client.funcs.end(client, msg, pos, command);
    }
  },
};