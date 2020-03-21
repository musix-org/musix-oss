module.exports = {
    name: 'skipto',
    alias: 'st',
    usage: '<point in queue>',
    description: 'Skip to a point in the queue',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, command) {
        const queue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            if (!args[1]) return msg.channel.send(`${client.messages.correctUsage}\`${command.usage}\``);
            const point = parseInt(args[1] - 1);
            if (isNaN(point)) return msg.channel.send(client.messages.validNumber);
            if (point > queue.songs.size) return msg.channel.send(client.messages.noSongs);
            if (point < 0) return msg.channel.send(client.messages.cantSkipToCurrent);
            for (let i = 0; i < point; i++) {
                queue.songs.shift();
            }
            queue.endReason = "skipto";
            queue.connection.dispatcher.end();
        }
    }
};
