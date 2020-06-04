module.exports = {
  name: "message",
  async execute(client, msg, Discord) {
    if (msg.author.bot || !msg.guild) return;
    if (!client.global.db.guilds[msg.guild.id]) return;
    let prefix = client.global.db.guilds[msg.guild.id].prefix;
    const args = msg.content.slice(prefix.length).split(" ");
    if (client.config.devMode) prefix = client.config.devPrefix;
    if (msg.mentions.users.first()) {
      if (msg.mentions.users.first().id === client.user.id) {
        if (!args[1]) return;
        if (args[1] === "prefix") {
          if (!args[2])
            return msg.channel.send(
              `${client.messages.prefixHere}\`${prefix}\`.`
            );
          if (args[2] === "=" && args[3]) return (prefix = args[3]);
        }
        args.shift();
        getCommand(client, args, msg, Discord);
      }
    }
    if (!msg.content.startsWith(prefix)) return;
    getCommand(client, args, msg, Discord);
  },
};

function getCommand(client, args, msg, Discord) {
  if (!args[0]) return;
  const commandName = args[0].toLowerCase();
  if (commandName === "none") return;
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.alias && cmd.alias.includes(commandName)
    );
  if (!command) return;
  if (command.onlyDev && msg.author.id !== client.config.devId) return;
  if (client.config.devMode && msg.member.id !== client.config.devId && msg.guild.id !== "718081535240306738")
    return msg.channel.send(client.messages.devMode);
  client.funcs.exe(msg, args, client, Discord, command);
}