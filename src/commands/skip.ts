module.exports = {
  name: "skip",
  alias: "s",
  usage: "",
  description: "Skip the currently playing song.",
  onlyDev: false,
  permission: "MANAGE_MESSAGES",
  category: "music",
  execute(msg, args, client, Discord, command) {
    const queue = client.queue.get(msg.guild.id);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (!queue || !queue.playing)
      return msg.channel.send(client.messages.noServerQueue);
    if (msg.author.id !== client.config.devId) {
      if (msg.member.voice.channel !== queue.voiceChannel)
        return msg.channel.send(client.messages.wrongVoiceChannel);
      if (client.global.db.guilds[msg.guild.id].permissions) {
        if (
          !msg.member.roles.cache.has(
            client.global.db.guilds[msg.guild.id].djrole
          ) ||
          !permissions.has(command.permission)
        ) {
          return vote(queue, msg, client);
        } else {
          return skipSong(queue, msg, client);
        }
      } else {
        return skipSong(queue, msg, client);
      }
    } else {
      return skipSong(queue, msg, client);
    }
  },
};
function skipSong(queue, msg, client) {
  msg.channel.send(client.messages.skipped);
  queue.endReason = "skip";
  queue.time = 0;
  queue.connection.dispatcher.end();
}
function vote(queue, msg, client) {
  queue.votesNeeded = Math.floor(queue.voiceChannel.members.size / 2);
  queue.votesNeeded.toFixed();
  if (queue.voiceChannel.members.size > 2) {
    if (queue.voters.includes(msg.member.id))
      return msg.channel.send(client.messages.alreadyVoted);
    queue.votes++;
    queue.voters.push(msg.member.id);
    if (queue.votes >= queue.votesNeeded) {
      queue.voters = [];
      queue.votes = 0;
      queue.votesNeeded = null;
      return skipSong(queue, msg, client);
    } else
      return msg.channel.send(
        `${client.messages.notEnoughVotes} ${queue.votes} / ${queue.votesNeeded}!`
      );
  } else {
    return skipSong(queue, msg, client);
  }
}
