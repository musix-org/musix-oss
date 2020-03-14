module.exports = async function (client, reason, guild) {
    const queue = client.queue.get(guild.id);
    queue.playing = false;
    if (reason === "seek") {
        return;
    }
    if (!queue.songLooping) {
        if (queue.looping) {
            queue.songs.push(queue.songs[0]);
        }

        queue.votes = 0;
        queue.voters = [];
        queue.songs.shift();
    }
    client.funcs.play(guild, queue.songs[0], client, 0, true);
};