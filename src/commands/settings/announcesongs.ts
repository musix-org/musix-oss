module.exports = {
    name: 'announcesongs',
    async execute(msg, args, client) {
        if (!args[2]) return msg.channel.send(`${client.messages.announceSongs} \`${client.global.db.guilds[msg.guild.id].permissions}\``);
        if (args[2] === 'true') {
            if (!client.global.db.guilds[msg.guild.id].announceSongs) {
                client.global.db.guilds[msg.guild.id].announceSongs = true;
                msg.channel.send(client.messages.permissionsSetTrue);
            } else return msg.channel.send(client.messages.announceSongsTrue);
        } else if (args[2] === 'false') {
            if (client.global.db.guilds[msg.guild.id].announceSongs) {
                client.global.db.guilds[msg.guild.id].announceSongs = false;
                msg.channel.send(client.messages.announceSongsFalse);
            } else return msg.channel.send(client.messages.announceSongsFalse);
        } else return msg.channel.send(client.messages.boolean);
    }
};