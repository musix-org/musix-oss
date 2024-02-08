module.exports = {
    name: 'play',
    async execute(message, args, client, Discord, prefix) {
        const serverQueue = client.queue.get(message.guild.id);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
            return message.channel.send(':x: I cannot connect to your voice channel, make sure I have the proper permissions!');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send(':x: I cannot speak in your voice channel, make sure I have the proper permissions!');
        }
        let songs;
        if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
        if (args[2]) {
            if (client.global.db.guilds[args[2]].premium && client.global.db.playlists[args[2]].saved) {
                songs = client.global.db.playlists[args[2]].songs;
            } else return message.channel.send(':x: There is no queue saved for this guild!')
        } else {
            songs = client.global.db.playlists[message.guild.id].songs;
        }
        if (client.global.db.playlists[message.guild.id].saved) {
            if (!serverQueue) {
                const construct = {
                    textChannel: message.channel,
                    voiceChannel: message.member.voiceChannel,
                    connection: null,
                    songs: [...songs],
                    volume: client.global.db.guilds[message.guild.id].defaultVolume,
                    playing: false,
                    looping: false,
                    paused: false,
                    votes: 0,
                    voters: [],
                    votesNeeded: null
                };
                client.queue.set(message.guild.id, construct);
                message.channel.send(":white_check_mark: Queue set!");
                try {
                    var connection = await message.member.voiceChannel.join();
                    construct.connection = connection;
                    client.funcs.play(message.guild, construct.songs[0], client, message, 0, false);
                } catch (error) {
                    client.queue.delete(message.guild.id);
                    return message.channel.send(`:x: An error occured: ${error}`);
                }
            } else {
                serverQueue.connection.dispatcher.end("queue set");
                serverQueue.songs = [...client.global.db.playlists[message.guild.id].songs];
                message.channel.send(":white_check_mark: Queue set!");
            }
        } else return message.channel.send(':x: There is no queue set for this server!')
    }
};