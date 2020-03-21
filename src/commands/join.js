module.exports = {
    name: 'join',
    alias: 'j',
    usage: '',
    description: 'Make Musix join the channel your channel',
    onlyDev: true,
    permission: 'none',
    category: 'util',
    async execute(msg, args, client, Discord, command) {
        try {
            const queue = client.queue.get(msg.guild.id);
            const voiceChannel = msg.member.voice.channel;
            const connection = await voiceChannel.join();
            if (queue) {
                queue.connection = connection;
            }
            msg.channel.send(`${client.messages.joined} ${voiceChannel.name}!`);
        } catch (error) {
            client.queue.delete(msg.guild.id);
            client.channels.get(client.config.debug_channel).send(client.messages.errorConnecting + error);
            return msg.channel.send(client.messages.error);
        }
    }
};