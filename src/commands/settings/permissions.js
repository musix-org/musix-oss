module.exports = {
    name: 'permissions',
    async execute(msg, args, client, Discord, prefix) {
        if (!args[2]) return msg.channel.send(`🔒 Permission requirement: \`${client.global.db.guilds[msg.guild.id].permissions}\``);
        if (args[2] === 'true') {
            if (!client.global.db.guilds[msg.guild.id].permissions) {
                client.global.db.guilds[msg.guild.id].permissions = true;
                msg.channel.send(`<:green_check_mark:674265384777416705> Permissions requirement now set to: \`true\``);
            } else return msg.channel.send('<:redx:674263474704220182> That value is already `true`!');
        } else if (args[2] === 'false') {
            if (client.global.db.guilds[msg.guild.id].permissions) {
                client.global.db.guilds[msg.guild.id].permissions = false;
                msg.channel.send(`<:green_check_mark:674265384777416705> Permissions requirement now set to: \`false\``);
            } else return msg.channel.send('<:redx:674263474704220182> That value is already `false`!');
        } else return msg.channel.send('<:redx:674263474704220182> Please define a boolean! (true/false)');
    }
};