module.exports = {
    name: 'remove',
    async execute(message, args, client, Discord, prefix) {
        if (client.global.db.playlists[message.guild.id].saved) {
            if (!args[2]) return message.channel.send(':x: Please provide a number on the position of the song that you wan\'t to remove!');
            const songNum = parseInt(args[2]) - 1;
            if (isNaN(songNum)) return message.channel.send(':x: You need to enter a __number__!');
            if (songNum === 0) return message.channel.send(':x: You can not remove the currently playing song!');
            if (parseInt(songNum) > client.global.db.playlists[message.guild.id].songs.size) return message.channel.send(`:x: There is only ${serverQueue.songs.size} amount of songs in the queue!`);
            message.channel.send(`🗑️ removed \`${client.global.db.playlists[message.guild.id].songs[songNum].title}\` from the playlist!`);
            return client.global.db.playlists[message.guild.id].songs.splice(songNum, 1);
        } else return message.channel.send(':x: There is no playlist saved! Start by using the save option!');
    }
};