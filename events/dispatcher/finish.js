module.exports = async function (client, reason, guild) {
    const serverQueue = client.queue.get(guild.id);
    serverQueue.playing = false;
    if (reason === "Stream is not generating quickly enough.") {
        console.log("Song ended");
    } else if (reason === "seek") {
        return;
    } else {
        console.log(reason);
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