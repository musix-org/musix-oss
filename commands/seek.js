module.exports = {
    name: 'seek',
    alias: 'none',
    usage: '<point in song(seconds)>',
    description: 'Seek to a specific point in the currently playing song.',
    onlyDev: true,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, prefix, command) {
        const ytdl = require('ytdl-core');
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
            if (!args[1]) return msg.channel.send(`<:redx:674263474704220182> Correct usage: \`${prefix}seek <seeking point in seconds>\``);
            const pos = parseInt(args[1]);
            if (isNaN(pos)) return msg.channel.send('<:redx:674263474704220182> I\'m sorry, But you need to enter a valid __number__.');
            if (pos < 0) return msg.channel.send('<:redx:674263474704220182> The seeking point needs to be a positive number!');
            if (pos > data.length_seconds) return msg.channel.send(`<:redx:674263474704220182> The lenght of this song is ${data.length_seconds} seconds! You can't seek further than that!`);
            serverQueue.connection.dispatcher.end('seek');
            client.funcs.play(msg.guild, serverQueue.songs[0], client, msg, pos, false);
        }
    }
};
