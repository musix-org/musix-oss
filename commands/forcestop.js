module.exports = {
    name: 'forcestop',
    description: 'force stop command.',
    alias: 'fs',
    cooldown: 5,
    onlyDev: true,
    execute(message, args, client, Discord, prefix) {
        client.queue.delete(message.guild.id);
        message.channel.send('queue deleted')
    }
};
