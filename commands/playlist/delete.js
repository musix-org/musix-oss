module.exports = {
    name: 'delete',
    async execute(message, args, client, prefix) {
        client.global.db.playlists[message.guild.id] = {
            songs: [],
            firstSong: undefined,
            saved: false,
        };
        message.channel.send(':wastebasket: Deleted the playlist.');
    }
};
