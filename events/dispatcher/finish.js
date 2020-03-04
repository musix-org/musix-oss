module.exports = async function (client, reason, guild) {
    const serverQueue = client.queue.get(guild.id);
    serverQueue.playing = false;
    if (reason === "seek") {
        return;
    }
    if (!serverQueue.songLooping) {
        if (serverQueue.looping) {
            serverQueue.songs.push(serverQueue.songs[0]);
        }

        serverQueue.votes = 0;
        serverQueue.voters = [];
        serverQueue.songs.shift();
    }
    client.funcs.play(guild, serverQueue.songs[0], client, 0, true);
};