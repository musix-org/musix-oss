module.exports = {
    name: 'seek',
    description: 'seek command.',
    alias: 'seek',
    cooldown: 10,
    async execute(message, args, client, Discord, prefix) {
        const ytdl = require('ytdl-core');
        const serverQueue = client.queue.get(message.guild.id);
        const permissions = message.channel.permissionsFor(message.author);
        const { voiceChannel } = message.member;
        let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
        if (serverQueue) {
            if (message.author.id !== client.config.devId) {
                return message.channel.send(':x: This command is currently disabled!');
                if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to seek the song!');
                if (client.global.db.guilds[message.guild.id].permissions === true) {
                    if (client.global.db.guilds[message.guild.id].dj) {
                        if (!message.member.roles.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to seek the song!');
                    } else if (!permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to seek the song!');
                }
            }
            if (!args[1]) return message.channel.send(`:x: Correct usage: \`${prefix}seek <seeking point in seconds>\``);
            const pos = parseInt(args[1])
            if (isNaN(pos)) return message.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.');
            if (pos < 0) return message.channel.send(':x: The seeking point needs to be a positive number!');
            if (pos > data.length_seconds) return message.channel.send(`:x: The lenght of this song is ${data.length_seconds} seconds! You can't seek further than that!`);
            serverQueue.connection.dispatcher.end('seek');
            client.funcs.play(message.guild, serverQueue.songs[0], client, message, pos, false);
        } else {
            message.channel.send(':x: There is nothing playing!');
        }
    }
};
