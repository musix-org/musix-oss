module.exports = {
    name: 'seek',
    alias: 'none',
    usage: '<point in song>',
    description: 'Seek to a specific point in the currently playing song.',
    onlyDev: true,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, prefix, command) {
        const ytdl = require('ytdl-core');
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
            if (!args[1]) return msg.channel.send(`${client.messages.correctUsage}\`${prefix}seek ${command.usage}\``);
            let point = args[1];
            const pos = parseInt(args[1]);
            if (isNaN(pos)) {
                if (pos < 0) return msg.channel.send(client.messages.seekingPointPositive);
                client.messages.seekMax = client.messages.seekMax.replace("%LENGTH%", data.length_seconds);
                if (pos > data.length_seconds) return msg.channel.send(client.messages.seekMax);
                point = pos;
            }
            serverQueue.connection.dispatcher.end();
            serverQueue.endReason = "seek";
            client.funcs.play(msg.guild, serverQueue.songs[0], client, msg, point, false);
        }
    }
};
