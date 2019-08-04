module.exports = {
    name: 'duplicate',
    description: 'Duplicate command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to duplicate songs!');
        if (!args[1]) return message.channel.send(':x: You need to enter the position for the song you want to duplicate!')
        if (isNaN(args[1])) return msg.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.');
        serverQueue.songs.push(serverQueue.songs[args[1]])
        return msg.channel.send(`Duplicated ${serverQueue.songs[args[1]].title}`)
    }
};
