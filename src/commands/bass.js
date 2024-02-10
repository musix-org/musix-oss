module.exports = {
  name: "bass",
  description: "Boost the bass in your music!",
  alias: ["none"],
  usage: "<bass>",
  permission: "MANAGE_MESSAGES",
  category: "audio modifiers",
  execute(msg, args, client, command) {
    const queue = client.queue.get(msg.guild.id);
    if (!args[1] && queue)
      return msg.channel.send(
        `${client.messages.currentBass}**${queue.bass}**`
      );
    const bass = parseFloat(args[1]);
    if (client.funcs.check(client, msg, command)) {
      if (queue.nightCore)
        return msg.channel.send(client.messages.disableNightCore);
      if (isNaN(bass)) return msg.channel.send(client.messages.validNumber);
      if (bass > 10) return msg.channel.send(client.messages.maxBass);
      if (bass < 0) return msg.channel.send(client.messages.positiveBass);
      queue.bass = bass;
      client.funcs.end(
        client,
        msg,
        (queue.connection.dispatcher.streamTime + queue.time) / 1000,
        command
      );
      let message;
      message = client.messages.bassApplied.replace("%BASS%", bass);
      return msg.channel.send(message);
    }
  },
};
