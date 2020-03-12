module.exports = function (client, msg, command) {
    const serverQueue = client.queue.get(msg.guild.id);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (!serverQueue || !serverQueue.playing) return msg.channel.send(client.messages.noServerQueue);
    if (msg.author.id !== client.config.devId) {
        if (msg.member.voice.channel !== serverQueue.voiceChannel) return msg.channel.send(client.messages.wrongVoiceChannel);
        if (client.global.db.guilds[msg.guild.id].permissions === true) {
            if (client.global.db.guilds[msg.guild.id].dj) {
                if (!msg.member.roles.cache.has(client.global.db.guilds[msg.guild.id].djrole)) {
                    msg.channel.send(client.messages.noDj);
                    return false;
                } else return true;
            } else if (!permissions.has(command.permission)) {
                client.messages.noPerms = client.messages.noPerms.replace("%PERMS%", commands.permissions);
                msg.channel.send(client.messages.noPerms);
                return false;
            } else return true;
        } else return true;
    } else return true;
};
