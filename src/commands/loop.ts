module.exports = {
    name: 'loop',
    alias: 'none',
    usage: '',
    description: 'loop the queue.',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, command) {
        const queue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            if (!queue.looping) {
                queue.looping = true;
                msg.channel.send(client.messages.looping);
            } else {
                queue.looping = false;
                msg.channel.send(client.messages.noLooping);
            }
        }
    }
};
