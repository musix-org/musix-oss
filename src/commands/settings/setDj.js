module.exports = {
    name: 'setdj',
    async execute(msg, args, client) {
        if (!client.global.db.guilds[msg.guild.id].dj) {
            if (!client.global.db.guilds[msg.guild.id].permissions) {
                client.global.db.guilds[msg.guild.id].permissions = true;
            }
            if (msg.guild.roles.cache.find(x => x.name === "DJ")) {
                client.global.db.guilds[msg.guild.id].djrole = msg.guild.roles.cache.find(x => x.name === "DJ").id;
                msg.channel.send(client.messages.djRoleFound);
                client.global.db.guilds[msg.guild.id].dj = true;
            } else {
                const permissions = msg.channel.permissionsFor(msg.client.user);
                if (!permissions.has('MANAGE_ROLES')) return msg.channel.send(client.messages.noPermsManageRoles);
                msg.guild.createRole({
                        name: 'DJ',
                    })
                    .then(role => client.global.db.guilds[msg.guild.id].djrole = role.id)
                    .catch((error) => {
                        console.log(error);
                    })
                client.global.db.guilds[msg.guild.id].dj = true;
                msg.channel.send(client.messages.djRoleCreated);
            }
        } else {
            client.global.db.guilds[msg.guild.id].dj = false;
            msg.channel.send(client.messages.djFalse);
        }
    }
};