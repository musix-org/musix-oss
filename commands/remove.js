module.exports = {
    name: 'remove',
    alias: 'rm',
    usage: '<song pos>',
    description: 'Remove a song from the queue',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    execute(msg, args, client, Discord, prefix, command) {
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            if (!args[1]) return msg.channel.send('<:redx:674263474704220182> Please provide a song position in queue for me to remove!');
            const pos = parseInt(args[1]);
            if (isNaN(pos)) return msg.channel.send('<:redx:674263474704220182> You need to enter a number!');
            if (pos < 1) return msg.channel.send('<:redx:674263474704220182> That songs does not exist!');
            if (pos > serverQueue.songs.length) return msg.channel.send(`<:redx:674263474704220182> There is only ${serverQueue.songs.length} amount of songs in the queue!`);
            msg.channel.send(`🗑️ removed \`${serverQueue.songs[pos].title}\` from the queue!`);
            return serverQueue.songs.splice(pos, 1);
        }
    }
};
