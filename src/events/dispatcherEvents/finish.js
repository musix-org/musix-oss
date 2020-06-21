module.exports = {
  async execute(client, guild) {
    const queue = client.queue.get(guild.id);
    queue.playing = false;
    if (queue.endReason === "seek") {
      return (queue.playing = true);
    }

    if (!queue.songLooping) {
      if (queue.looping) {
        queue.songs.push(queue.songs[0]);
      }

      queue.time = 0;
      queue.votes = 0;
      queue.voters = [];
      if (queue.endReason !== "replay") {
        if (queue.endReason === "previous") queue.songs.unshift(queue.prevSongs.pop())
        if (queue.endReason !== "previous") queue.prevSongs.push(queue.songs.shift());
      }
    }
    client.funcs.play(guild, queue.songs[0], client, 0, true);
  },
};