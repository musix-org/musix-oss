module.exports = function (client, msg, command) {
    const serverQueue = client.queue.get(msg.guild.id);
    const permissions = msg.channel.permissionsFor(msg.author);
    if (!serverQueue || !serverQueue.playing) return msg.channel.send('<:redx:674263474704220182> There is nothing playing!');
    if (msg.author.id !== client.config.devId) {
        if (msg.member.voice.channel !== serverQueue.voiceChannel) return msg.channel.send(`<:redx:674263474704220182> I'm sorry but you need to be in the same voice channel as Musix to use this command!`);
        if (client.global.db.guilds[msg.guild.id].permissions === true) {
            if (client.global.db.guilds[msg.guild.id].dj) {
                if (!msg.member.roles.cache.has(client.global.db.guilds[msg.guild.id].djrole)) {
                    msg.channel.send('<:redx:674263474704220182> You need the `DJ` role to use this command!');
                    return false;
                } else return true;
            } else if (!permissions.has(command.permission)) {
                msg.channel.send(`<:redx:674263474704220182> You need the \`${command.permission}\` permission to use this command!`);
                return false;
            } else return true;
        } else return true;
    } else return true;
};
