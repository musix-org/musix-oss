module.exports = {
    name: 'disconnect',
    alias: 'dc',
    usage: '',
    description: 'Disconnect the bot from a voice channel.',
    onlyDev: true,
    permission: 'MANAGE_CHANNELS',
    category: 'util',
    async execute(msg, args, client, Discord, prefix, command) {
        const serverQueue = client.queue.get(msg.guild.id);
        if (msg.author.id !== client.config.devId) {
            if (msg.member.voice.channel !== serverQueue.voiceChannel) return msg.channel.send(`<:redx:674263474704220182> I'm sorry but you need to be in the same voice channel as Musix to use this command!`);
            if (client.global.db.guilds[msg.guild.id].permissions === true) {
                if (client.global.db.guilds[msg.guild.id].dj) {
                    if (!msg.member.roles.has(client.global.db.guilds[msg.guild.id].djrole)) {
                        msg.channel.send('<:redx:674263474704220182> You need the `DJ` role to use this command!');
                    };
                } else if (!permissions.has(command.permission)) {
                    msg.channel.send(`<:redx:674263474704220182> You need the \`${command.permission}\` permission to use this command!`);
                }
            };
        }
        if (serverQueue && serverQueue.playing) {
            return msg.channel.send('<:redx:674263474704220182> There is something playing! Use the `stop` command instead!');
        }
        if (msg.guild.voiceConnection) {
            msg.guild.voiceConnection.channel.leave();
            msg.channel.send('<:green_check_mark:674265384777416705> Left the voice channel!');
        } else {
            msg.channel.send('<:redx:674263474704220182> i\'m not connected to a voice channel!')
        }
    }
};