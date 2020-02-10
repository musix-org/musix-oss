module.exports = {
    name: 'loop',
    alias: 'none',
    usage: 'loop',
    description: 'loop the queue.',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, prefix, command) {
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            if (!serverQueue.looping) {
                serverQueue.looping = true;
                msg.channel.send('<:repeat1:674685561377914892> Looping the queue now!');
            } else {
                serverQueue.looping = false;
                msg.channel.send('<:repeat1:674685561377914892> No longer looping the queue!');
            }
        }
    }
};
