module.exports = {
    name: 'announcesongs',
    async execute(msg, args, client, Discord, prefix) {
        if (client.global.db.guilds[msg.guild.id].startPlaying) {
            client.global.db.guilds[msg.guild.id].startPlaying = false;
            return msg.channel.send(client.messages.announceSongsFalse);
        } else {
            client.global.db.guilds[msg.guild.id].startPlaying = true;
            return msg.channel.send(client.messages.announceSongsTrue);
        }
    }
};