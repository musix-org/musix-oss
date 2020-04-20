module.exports = {
  name: "nigthcore",
  alias: "nc",
  usage: "<true/false>",
  description: "Change nigthcore on/off",
  onlyDev: false,
  permission: "MANAGE_MESSAGES",
  category: "music",
  async execute(msg, args, client, Discord, command) {
    const queue = client.queue.get(msg.guild.id);
    if (!args[1] && queue)
      return msg.channel.send(
        `${client.messages.currentNigthCore}**${queue.nigthCore}**`
      );
    if (client.funcs.check(client, msg, command)) {
      if (args[1] === "true") {
        queue.nigthCore = true;
      } else if (args[1] === "false") {
        queue.nigthCore = false;
      } else return msg.channel.send(client.messages.boolean);
      let message;
      message = client.messages.nigthCoreApplied.replace("%BOOLEAN%", args[1]);
      return msg.channel.send(message);
    }
  },
};
