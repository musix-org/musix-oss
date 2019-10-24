module.exports = {
    name: 'remove',
    description: 'Remove command.',
    cooldown: 5,
    execute(message, args, client, Discord, prefix) {
        const { voiceChannel } = message.member;
        const serverQueue = client.queue.get(message.guild.id);
        const permissions = message.channel.permissionsFor(message.author);
        if (!serverQueue) return message.channel.send(':x: There is nothing playing');
        if (isNaN(args[1])) return message.channel.send(':x: You need to enter a number!');
        if (args[1] === "0") return message.channel.send(':x: You can not remove the currently playing song!');
        if (args[1] > serverQueue.songs.size) return message.channel.send(`:x: There is only ${serverQueue.songs.size} amount of songs in the queue!`);
        if (message.author.id !== '360363051792203779') {
            if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to remove songs!');
            if (client.global.db.guilds[message.guild.id].dj) {
                if (serverQueue.songs[args[1]].author !== message.author) {
                    if (!message.member.roles.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to remove songs queue by others!');
                }
            } else if (!permissions.has('MANAGE_MESSAGES') && serverQueue.songs[args[1]].author !== message.author) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to remove songs queued by others!');
        }
        message.channel.send(`🗑️ removed \`${serverQueue.songs[args[1]].title}\` from the queue!`);
        return serverQueue.songs.splice(args[1], 1);
    }
};
