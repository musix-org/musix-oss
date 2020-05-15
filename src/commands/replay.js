module.exports = {
    name: 'replay',
    alias: ["rp"],
    usage: '',
    description: 'Replay the currently playing song.',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, command) {
        const queue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            queue.endReason = "replay";
            queue.connection.dispatcher.end()
        }
    }
};