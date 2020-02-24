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
                msg.channel.send(`<:repeatsong:674685573419761716> Looping **${serverQueue.songs[0].title}** now!`);
            } else {
                serverQueue.songLooping = false;
                msg.channel.send('<:repeatsong:674685573419761716> No longer looping the song!');
            }
        }
    }
};
