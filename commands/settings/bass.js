module.exports = {
    name: 'bass',
    async execute(msg, args, client, Discord, prefix) {
        if (!args[2]) return msg.channel.send(client.messages.currentDefaultBass + client.global.db.guilds[msg.guild.id].bass);
        if (args[2] === "false") {
            client.global.db.guilds[msg.guild.id].bass = false;
            msg.channel.send(client.messages.bassFalse);
        }
        const level = parseInt(args[2]);
        if (isNaN(level)) return msg.channel.send(client.messages.validNumber);
        client.global.db.guilds[msg.guild.id].bass = level;
        msg.channel.send(`${client.messages.bassLevel} ${level}!`);
    }
};