module.exports = {
    name: 'message',
    async execute(client, message, Discord) {
        if (message.author.bot || !message.guild) return;
        if (message.content === '->reset' && message.author.id === client.config.devId) {
            client.guilds.forEach(guild => {
                client.global.db.guilds[guild.id] = {
                    prefix: client.config.prefix,
                    defaultVolume: 5,
                    permissions: false,
                    premium: false,
                    dj: false,
                    djrole: null
                };
                return message.channel.send(':white_check_mark: Reset all guild settings for __all__ guilds!');
            });
            return message.channel.send(':white_check_mark: Reset all guild settings!')
        } else if (message.content === '->resetguildsettings' && message.author.id === client.config.devId) {
            client.global.db.guilds[message.guild.id] = {
                prefix: client.config.prefix,
                defaultVolume: 5,
                permissions: false,
                premium: false,
                dj: false,
                djrole: null
            };
            return message.channel.send(':white_check_mark: Reset all guild settings for this guild!');
        }
        let prefix = client.global.db.guilds[message.guild.id].prefix;
        const args = message.content.slice(prefix.length).split(' ');
        let commandName;
        if (message.mentions.users.first()) {
            if (message.mentions.users.first().id === client.user.id) {
                if (!args[1]) return;
                if (args[1] === 'prefix') return message.channel.send(`My prefix here is: \`${prefix}\`.`);
                commandName = args[1].toLowerCase();
                const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.commandAliases.get(commandName);
                client.funcs.exe(message, args, client, Discord, prefix, command);
            }
        }
        if (!message.content.startsWith(prefix)) return;
        if (!args[0]) return;
        commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.commandAliases.get(commandName);
        if (!command && message.content !== `${prefix}`) return;
        client.funcs.exe(message, args, client, Discord, prefix, command);
    }
}
