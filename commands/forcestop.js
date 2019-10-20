module.exports = {
    name: 'stop',
    description: 'Stop command.',
    cooldown: 5,
    execute(message, args, client, Discord, prefix) {
        if (message.author.id !== '360363051792203779') return message.channel.send(':x: You are not allowed to do that!')
        client.queue.delete(guild.id);
    }
};