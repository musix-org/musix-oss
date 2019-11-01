module.exports = {
    name: 'message',
    async execute(client, message, Discord) {
        if (message.author.bot || !message.guild) return;
        let prefix = client.global.db.guilds[message.guild.id].prefix;
        const args = message.content.slice(prefix.length).split(' ');
        if (message.mentions.users.first()) {
            if (message.mentions.users.first().id === client.user.id) {
                if (!args[1]) return;
                if (args[1] === 'prefix') return message.channel.send(`My prefix here is: \`${prefix}\`.`);
                if (args[1] === 'help') {
                    const command = client.commands.get("help");
                    return client.funcs.exe(message, args, client, Discord, prefix, command);
                }
            }
        }
        if (!message.content.startsWith(prefix)) return;
        if (!args[0]) return;
        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || client.commandAliases.get(commandName);
        if (!command && message.content !== `${prefix}`) return;
        if (command.onlyDev && message.author.id !== client.config.dev) return message.channel.send(':x: You are not allowed to do that!');
        client.funcs.exe(message, args, client, Discord, prefix, command);
    }
}
