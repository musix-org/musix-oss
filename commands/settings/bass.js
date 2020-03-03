module.exports = {
    name: 'bass',
    async execute(msg, args, client, Discord, prefix) {
        if (!args[2]) return msg.channel.send('Currect bass level: ' + client.global.db.guilds[msg.guild.id].bass);
        if (args[2] === "false") {
            client.global.db.guilds[msg.guild.id].bass = false;
            msg.channel.send(`Bass is now false!`);
        }
        const level = parseInt(args[2]);
        if (isNaN(level)) return msg.channel.send('You need to provide a number?');
        client.global.db.guilds[msg.guild.id].bass = level;
        msg.channel.send(`Bass level is now ${level}!`);
    }
};