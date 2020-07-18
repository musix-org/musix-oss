module.exports = {
  name: "nightcore",
  alias: ["nc"],
  usage: "<true/false>",
  description: "Change nightcore audio modifier on/off",
  onlyDev: false,
  permission: "MANAGE_MESSAGES",
  category: "audio modifiers",
  async execute(msg, args, client, Discord, command) {
    const queue = client.queue.get(msg.guild.id);
    if (!args[1] && queue)
      return msg.channel.send(
        `${client.messages.currentNightCore}**${queue.nightCore}**`
      );
    if (client.funcs.check(client, msg, command)) {
      if (args[1] === "true") {
        queue.nightCore = true;
      } else if (args[1] === "false") {
        queue.nightCore = false;
      } else return msg.channel.send(client.messages.boolean);
      let message;
      message = client.messages.nightCoreApplied.replace("%BOOLEAN%", args[1]);
      return msg.channel.send(message);
    }
  },
};