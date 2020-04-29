module.exports = {
    name: 'previous',
    alias: 'prev',
    usage: '',
    description: 'Play the previous song.',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, command) {
        const queue = client.queue.get(msg.guild.id)
        if (client.funcs.check(client, msg, command)) {
            if (queue.prevSongs.length < 1) return msg.channel.send(client.messages.noPreviousSongs);
            queue.endReason = "previous";
            queue.connection.dispatcher.end()
            msg.channel.send(client.messages.previousSong)
        }
    }
};