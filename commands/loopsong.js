module.exports = {
    name: 'loopsong',
    alias: 'loops',
    usage: '',
    description: 'loop the currently playing song.',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    async execute(msg, args, client, Discord, prefix, command) {
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            if (!serverQueue.songLooping) {
                serverQueue.songLooping = true;
                let message;
                message = client.messages.loopingSong.replace("%TITLE%", serverQueue.songs[0].title);
                msg.channel.send(message);
            } else {
                serverQueue.songLooping = false;
                msg.channel.send(message);
            }
        }
    }
};
