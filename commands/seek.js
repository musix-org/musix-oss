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
            let point = args[1];
            const pos = parseInt(args[1]);
            if (isNaN(pos)) {
                if (pos < 0) return msg.channel.send('<:redx:674263474704220182> The seeking point needs to be a positive number!');
                if (pos > data.length_seconds) return msg.channel.send(`<:redx:674263474704220182> The lenght of this song is ${data.length_seconds} seconds! You can't seek further than that!`);
                point = pos;
            }
            serverQueue.connection.dispatcher.end();
            serverQueue.endReason = "seek";
            client.funcs.play(msg.guild, serverQueue.songs[0], client, msg, point, false);
        }
    }
};
