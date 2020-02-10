module.exports = {
    name: 'setdj',
    async execute(msg, args, client, Discord, prefix) {
        if (!client.global.db.guilds[msg.guild.id].dj) {
            if (!client.global.db.guilds[msg.guild.id].permissions) {
                client.global.db.guilds[msg.guild.id].permissions = true;
            }
            if (msg.guild.roles.find(x => x.name === "DJ")) {
                client.global.db.guilds[msg.guild.id].djrole = msg.guild.roles.find(x => x.name === "DJ").id;
                msg.channel.send('<:green_check_mark:674265384777416705> I found a `DJ` role from this guild! This role is now the DJ role.');
                client.global.db.guilds[msg.guild.id].dj = true;
            } else {
                const permissions = msg.channel.permissionsFor(msg.client.user);
                if (!permissions.has('MANAGE_ROLES')) return msg.channel.send('<:redx:674263474704220182> I cannot create roles (Manage roles), make sure I have the proper permissions! I will need this permission to create a `DJ` role since i did not find one!');
                msg.guild.createRole({
                    name: 'DJ',
                })
                    .then(role => client.global.db.guilds[msg.guild.id].djrole = role.id)
                    .catch(console.error)
                client.global.db.guilds[msg.guild.id].dj = true;
                msg.channel.send('<:green_check_mark:674265384777416705> I did not find a role `DJ` so i have created one for you!');
            }
        } else {
            client.global.db.guilds[msg.guild.id].dj = false;
            msg.channel.send('<:green_check_mark:674265384777416705> `DJ` now set to `false`');
        }
    }
};