module.exports = {
    name: 'loop',
    alias: 'none',
    usage: '',
    description: 'loop the queue.',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, prefix, command) {
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            if (!serverQueue.looping) {
                serverQueue.looping = true;
                msg.channel.send(client.messages.looping);
            } else {
                serverQueue.looping = false;
                msg.channel.send(client.messages.noLooping);
            }
        }
    }
};
