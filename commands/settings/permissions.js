module.exports = {
    name: 'permissions',
    async execute(msg, args, client, Discord, prefix) {
        if (!args[2]) return msg.channel.send(`${client.messages.permissions} \`${client.global.db.guilds[msg.guild.id].permissions}\``);
        if (args[2] === 'true') {
            if (!client.global.db.guilds[msg.guild.id].permissions) {
                client.global.db.guilds[msg.guild.id].permissions = true;
                msg.channel.send(client.messages.permissionsSetTrue);
            } else return msg.channel.send(client.messages.permissionsTrue);
        } else if (args[2] === 'false') {
            if (client.global.db.guilds[msg.guild.id].permissions) {
                client.global.db.guilds[msg.guild.id].permissions = false;
                msg.channel.send(client.messages.permissionsSetFalse);
            } else return msg.channel.send(client.messages.permissionsFalse);
        } else return msg.channel.send(client.messages.boolean);
    }
};