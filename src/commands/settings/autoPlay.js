module.exports = {
    name: 'autoplay',
    async execute(msg, args, client) {
        if (!args[2]) return msg.channel.send(`${client.messages.autoPlay} \`${client.global.db.guilds[msg.guild.id].autoPlay}\``);
        if (args[2] === 'true') {
            if (!client.global.db.guilds[msg.guild.id].autoPlay) {
                client.global.db.guilds[msg.guild.id].autoPlay = true;
                msg.channel.send(client.messages.autoPlayTrue);
            } else return msg.channel.send(client.messages.autoPlayTrue);
        } else if (args[2] === 'false') {
            if (client.global.db.guilds[msg.guild.id].autoPlay) {
                client.global.db.guilds[msg.guild.id].autoPlay = false;
                msg.channel.send(client.messages.autoPlayFalse);
            } else return msg.channel.send(client.messages.autoPlayFalse);
        } else return msg.channel.send(client.messages.boolean);
    }
};