module.exports = {
    name: 'permissions',
    async execute(message, args, client, Discord, prefix) {
        if (!args[2]) return message.channel.send(`🔒 Permission requirement: \`${client.global.db.guilds[message.guild.id].permissions}\``);
        if (args[2] === 'true') {
            if (!client.global.db.guilds[message.guild.id].permissions) {
                client.global.db.guilds[message.guild.id].permissions = true;
                message.channel.send(`:white_check_mark: Permissions requirement now set to: \`true\``);
            } else return message.channel.send(':x: That value is already `true`!');
        } else if (args[2] === 'false') {
            if (client.global.db.guilds[message.guild.id].permissions) {
                client.global.db.guilds[message.guild.id].permissions = false;
                message.channel.send(`:white_check_mark: Permissions requirement now set to: \`false\``);
            } else return message.channel.send(':x: That value is already `false`!');
        } else return message.channel.send(':x: Please define a boolean! (true/false)');
    }
};