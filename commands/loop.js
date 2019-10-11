module.exports = {
    name: 'loop',
    description: 'loop command.',
    cooldown: 10,
    async execute(message, args, client, Discord, prefix) {
        const serverQueue = client.queue.get(message.guild.id);
        const permissions = message.channel.permissionsFor(message.author);
        const { voiceChannel } = message.member;
        if (serverQueue) {
            if (message.author.id !== '360363051792203779') {
                if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voiceChannel as Musix to loop the queue!');
                if (client.global.db.guilds[message.guild.id].permissions === true) {
                    if (!permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to loop the queue!');
                }
            }
            if (!serverQueue.looping) {
                client.secondaryQueue = [...serverQueue.songs]
                serverQueue.looping = true;
                message.channel.send(':repeat: Looping the queue now!');
            } else {
                serverQueue.looping = false;
                client.secondaryQueue = [];
                message.channel.send(':repeat: No longer looping the queue!');
            }
        } else {
            message.channel.send(':x: There is nothing playing!');
        }
    }
};
