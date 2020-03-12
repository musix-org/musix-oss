module.exports = {
    name: 'skipto',
    alias: 'st',
    usage: '<point in queue>',
    description: 'Skip to a point in the queue',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, prefix, command) {
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            if (!args[1]) return msg.channel.send(`${client.messages.correctUsage}\`${command.usage}\``);
            const point = parseInt(args[1] - 1);
            if (isNaN(point)) return msg.channel.send(client.messages.validNumber);
            if (point > serverQueue.songs.size) return msg.channel.send(client.messages.noSongs);
            if (point < 1) return msg.channel.send(client.messages.cantSkipToCurrent);
            let i = 0;
            while (i < point) {
                i++;
                serverQueue.songs.shift();
            }
            serverQueue.endReason = "skipto";
            serverQueue.connection.dispatcher.end();
        }
    }
};
