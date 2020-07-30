module.exports = {
  name: "seek",
  alias: ["none"],
  usage: "<point in song (seconds)>",
  description: "Seek to a specific point in the currently playing song.",
  onlyDev: false,
  permission: "MANAGE_MESSAGES",
  category: "music control",
  async execute(msg, args, client, Discord, command) {
    const queue = client.queue.get(msg.guild.id);
    if (client.funcs.check(client, msg, command)) {
      if (queue.nightCore)
        return msg.channel.send(client.messages.disableNightCore);
      if (!args[1])
        return msg.channel.send(
          `${client.messages.correctUsage}\`${
            client.global.db.guilds[msg.guild.id].prefix
          }seek ${command.usage}\``
        );
      const pos = parseInt(args[1]);
      if (isNaN(pos)) return msg.channel.send(client.messages.validNumber);
      if (pos < 0)
        return msg.channel.send(client.messages.seekingPointPositive);
      const totalLength = parseInt(queue.songs[0].info.lengthSeconds);
      let message;
      if (pos > totalLength) {
        message = client.messages.seekMax.replace(
          "%LENGTH%",
          queue.songs[0].info.lengthSeconds
        );
        return msg.channel.send(message);
      }

      client.funcs.end(client, msg, pos, command);
    }
  },
};
