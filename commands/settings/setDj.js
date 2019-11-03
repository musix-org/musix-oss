module.exports = {
    name: 'setdj',
    async execute(message, args, client, Discord, prefix) {
        if (!client.global.db.guilds[message.guild.id].dj) {
            if (!client.global.db.guilds[message.guild.id].permissions) {
                client.global.db.guilds[message.guild.id].permissions = true;
            }
            if (message.guild.roles.find(x => x.name === "DJ")) {
                client.global.db.guilds[message.guild.id].djrole = message.guild.roles.find(x => x.name === "DJ").id;
                message.channel.send(':white_check_mark: I found a `DJ` role from this guild! This role is now the DJ role.');
                client.global.db.guilds[message.guild.id].dj = true;
            } else {
                const permissions = message.channel.permissionsFor(message.client.user);
                if (!permissions.has('MANAGE_ROLES')) return message.channel.send(':x: I cannot create roles (Manage roles), make sure I have the proper permissions! I will need this permission to create a `DJ` role since i did not find one!');
                message.guild.createRole({
                    name: 'DJ',
                })
                    .then(role => client.global.db.guilds[message.guild.id].djrole = role.id)
                    .catch(console.error)
                client.global.db.guilds[message.guild.id].dj = true;
                message.channel.send(':white_check_mark: I did not find a role `DJ` so i have created one for you!');
            }
        } else {
            client.global.db.guilds[message.guild.id].dj = false;
            message.channel.send(':white_check_mark: `DJ` now set to `false`');
        }
    }
};