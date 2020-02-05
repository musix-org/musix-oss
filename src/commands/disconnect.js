module.exports = {
    name: 'disconnect',
    alias: 'dc',
    usage: 'disconnect',
    description: 'Disconnect the bot from a voice channel.',
    onlyDev: false,
    permission: 'MANAGE_CHANNELS',
    category: 'util',
    async execute(msg, args, client, Discord, prefix, command) {
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            serverQueue.voiceChannel.leave();
            msg.channel.send('<:green_check_mark:674265384777416705> Left the voice channel!');
        }
    }
};