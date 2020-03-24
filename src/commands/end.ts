module.exports = {
    name: 'end',
    alias: 'e',
    usage: '',
    description: 'end the queue',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, command) {
        client.queue.delete(msg.guild.id);
        msg.channel.send(client.messages.queueDeleted);
    }
};
