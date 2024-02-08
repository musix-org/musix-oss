module.exports = function (msg, args, client, Discord, command) {
  const permissions = msg.channel.permissionsFor(client.user);
  if (!permissions.has("EMBED_LINKS"))
    return msg.channel.send(client.messages.noPermsEmbed);
  if (!permissions.has("USE_EXTERNAL_EMOJIS"))
    return msg.channel.send(client.messages.noPermsUseExternalEmojis);
  if (
    command.category === "music" &&
    client.global.db.guilds[msg.guild.id].blacklist.includes(msg.channel.id)
  )
    return msg.channel.send(client.messages.musicCommandsDisabled);
  try {
    command.uses++;
    command.execute(msg, args, client, Discord, command);
  } catch (error) {
    msg.reply(client.messages.errorExe);
    console.log(error.toString());
    console.log(error.stack.replace(/at /g, "**at **"));
  }
};