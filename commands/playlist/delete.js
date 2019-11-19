module.exports = {
    name: 'delete',
    async execute(message, args, client, Discord, prefix) {
        client.global.db.playlists[message.guild.id] = {
            songs: [],
            firstSong: undefined,
            saved: false,
        };
        message.channel.send(':white_check_mark: This guild is now premium! :tada:')
    }
};