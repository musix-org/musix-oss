const similarSongs = require("similar-songs");

module.exports = {
    name: "searchsimilar",
    alias: ["none"],
    usage: "<song name>, <artist>",
    description: "a command to search similar songs (in developement)",
    onlyDev: false,
    permission: "none",
    category: "music",
    async execute(msg, args, client, Discord, command) {
        const searchString = args.slice(1).join(" ");
        const query = searchString.split(",");
        const queue = client.queue.get(msg.guild.id);
        const voiceChannel = msg.member.voice.channel;
        if (
            client.global.db.guilds[msg.guild.id].blacklist.includes(
                msg.member.voice.channelID
            )
        )
            return msg.channel.send(client.messages.blackListedVC);
        if (!queue) {
            if (!msg.member.voice.channel)
                return msg.channel.send(client.messages.noVoiceChannel);
        } else {
            if (voiceChannel !== queue.voiceChannel)
                return msg.channel.send(client.messages.wrongVoiceChannel);
        }
        if (!query[0] || !query[1]) {
            const message = client.messages.searchSimilarUsage.replace("%USAGE%", command.usage);
            return msg.channel.send(message);

        }
        if (voiceChannel.full) return msg.channel.send(client.messages.channelFull);
        if (!voiceChannel.joinable)
            return msg.channel.send(client.messages.noPermsConnect);
        if (!voiceChannel.speakable)
            return msg.channel.send(client.messages.noPermsSpeak);
        similarSongs.find({
                title: query[0],
                artist: query[1].slice(1),
                limit: 10,
                lastfmAPIKey: client.config.lastfm_api_key,
                lastfmAPISecret: client.config.lastfm_secret,
                youtubeAPIKey: client.config.api_key,
            },
            async function (err, songs) {
                if (err) return msg.channel.send(err.message);
                if (songs.length !== 0) {
                    const lmsg = await msg.channel.send(client.messages.loadingSongs);
                    for (let i = 0; i < songs.length; i++) {
                        client.funcs.handleVideo({
                            url: `https://www.youtube.com/watch?v=${songs[i].youtubeId}`
                        }, msg, voiceChannel, client, true, "ytdl");
                    }
                    const message = client.messages.songsAdded.replace(
                        "%AMOUNT%",
                        songs.length
                    );
                    return lmsg.edit(message);
                } else return msg.channel.send(client.messages.noSimilarResults);
            }
        );
    },
};