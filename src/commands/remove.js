module.exports = {
  name: "remove",
  alias: "rm",
  usage: "<song pos>",
  description: "Remove a song from the queue",
  onlyDev: false,
  permission: "MANAGE_MESSAGES",
  category: "music",
  execute(msg, args, client, Discord, command) {
    const queue = client.queue.get(msg.guild.id);
    if (client.funcs.check(client, msg, command)) {
      if (!args[1]) return msg.channel.send(client.messages.provideASong);
      const pos = parseInt(args[1]);
      if (isNaN(pos)) return msg.channel.send(client.messages.validNumber);
      if (pos < 1) return msg.channel.send(client.messages.noSongs);
      let message1;
      let message2;
      message1 = client.messages.queueLength.replace(
        "%LENGTH%",
        queue.songs.length
      );
      if (pos > queue.songs.length) return msg.channel.send(message1);
      message2 = client.messages.removed.replace(
        "%SONG%",
        queue.songs[pos].title
      );
      msg.channel.send(message2);
      return queue.songs.splice(pos, 1);
    }
  },
};