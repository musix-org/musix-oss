module.exports = {
    name: 'end',
    alias: ["none"],
    usage: '',
    description: 'just end it',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, command) {
        client.queue.delete(msg.guild.id);
        msg.channel.send(client.messages.queueDeleted);
    }
};