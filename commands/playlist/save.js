module.exports = {
    name: 'save',
    async execute(message, args, client, prefix) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send(':x: There is nothing playing!');
        client.global.db.playlists[message.guild.id] = {
            songs: serverQueue.songs,
            firstSong: serverQueue.songs[0],
            saved: true,
        };
        message.channel.send(":white_check_mark: Queue saved!");
    }
};
