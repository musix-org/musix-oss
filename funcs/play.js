module.exports = async function (guild, song, client) {
    const Discord = require('discord.js');
    const ytdl = require('ytdl-core');
    const serverQueue = client.queue.get(guild.id);
    if (!song) {
        serverQueue.textChannel.send(':stop_button: Music ended!');
        serverQueue.voiceChannel.leave();
        client.queue.delete(guild.id);
        return;
    }
    const dispatcher = serverQueue.connection
        .playStream(ytdl(song.url, { quality: `highestaudio`, filter: "audioonly" }), { seek: 0 })
        .on("end", reason => {
            if (reason === "Stream is not generating quickly enough.")
                console.log("Song ended");
            else console.log(reason);
            serverQueue.songs.shift();
            client.funcs.play(guild, serverQueue.songs[0], client);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    dispatcher.on("error", error => console.error(error));
    const data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
    const totallength = Math.floor(data.length_seconds / 60) + ':' + (data.length_seconds - (Math.floor(data.length_seconds / 60) * 60))
    const embed = new Discord.RichEmbed()
        .setTitle(`:musical_note: Start playing: **${song.title}**`)
        .setDescription(`Song duration: \`${totallength}\``)
        .setColor("#b50002")
    serverQueue.textChannel.send(embed);
}