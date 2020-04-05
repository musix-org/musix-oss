module.exports = function (client, msg, command) {
    const queue = client.queue.get(msg.guild.id);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (!queue || !queue.playing) {
        msg.channel.send(client.messages.noServerQueue);
        return false;
    }
    if (msg.author.id !== client.config.devId) {
        if (msg.member.voice.channel !== queue.voiceChannel) {
            msg.channel.send(client.messages.wrongVoiceChannel);
            return false;
        }
        if (client.global.db.guilds[msg.guild.id].permissions === true) {
            if (client.global.db.guilds[msg.guild.id].dj) {
                if (!msg.member.roles.cache.has(client.global.db.guilds[msg.guild.id].djrole)) {
                    msg.channel.send(client.messages.noDj);
                    return false;
                } else return true;
            } else if (!permissions.has(command.permission)) {
                let message
                message = client.messages.noPerms.replace("%PERMS%", command.permissions);
                msg.channel.send(message);
                return false;
            } else return true;
        } else return true;
    } else return true;
};
