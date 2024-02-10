module.exports = {
    name: 'previous',
    alias: ["prev", "return", "back"],
    usage: '',
    description: 'Play the previous song.',
    permission: 'MANAGE_MESSAGES',
    category: 'music control',
    async execute(msg, args, client, command) {
        const queue = client.queue.get(msg.guild.id)
        if (client.funcs.check(client, msg, command)) {
            if (queue.prevSongs.length < 1) return msg.channel.send(client.messages.noPreviousSongs);
            queue.endReason = "previous";
            queue.connection.dispatcher.end()
            msg.channel.send(client.messages.previousSong)
        }
    }
};
