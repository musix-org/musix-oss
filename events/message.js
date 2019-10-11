module.exports = {
    name: 'message',
    async execute(client, message, Discord) {
        if (message.author.bot || !message.guild) return;
        if (message.content.startsWith('->reset') && message.author.id === '360363051792203779') {
            client.guilds.forEach(guild => {
                client.global.db.guilds[guild.id] = {
                    prefix: ">",
                    defaultVolume: 5,
                    permissions: false,
                };
            });
            return message.channel.send(':white_check_mark: Reset all guild settings!')
        } else if (message.content.startsWith('->resetguildsettings') && message.author.id === '360363051792203779') {
            client.global.db.guilds[message.guild.id] = {
                prefix: ">",
                defaultVolume: 5,
                permissions: false,
            };
        }
        let prefix = client.global.db.guilds[message.guild.id].prefix;
        if (process.env.LOCALLYHOSTED === "true") {
            prefix = "-";
            if (message.author.id === "360363051792203779" || message.author.id === "384002606621655040") {

            } else return;
        }
        const args = message.content.slice(prefix.length).split(' ');
        if (message.mentions.users.first()) {
            if (message.mentions.users.first().id === '607266889537945605' && args[1] === 'help') return client.commands.get('help').execute(message, args, client, Discord, prefix, client);
            if (message.mentions.users.first().id === '607266889537945605' && args[1] === 'prefix') return message.channel.send(`My prefix here is: \`${prefix}\`.`);
        }
        if (!message.content.startsWith(prefix) || message.guild.id !== '583597555095437312') return;
        if (!args[0]) return;
        let commandName = args[0].toLowerCase();
        if (commandName === `p`) {
            commandName = 'play';
        }
        if (commandName === 'q') {
            commandName = 'queue';
        }
        if (commandName === 's') {
            commandName = 'skip';
        }
        if (commandName === 'np') {
            commandName = 'nowplaying';
        }
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has('EMBED_LINKS')) return message.channel.send(':x: I cannot send embeds (Embed links), make sure I have the proper permissions!');
        if (!command && message.content !== `${prefix}`) return;
        try {
            command.execute(message, args, client, Discord, prefix);
        } catch (error) {
            message.reply(`:x: there was an error trying to execute that command! Please contact support with \`${prefix}bug\`!`);
            const embed = new Discord.RichEmbed()
                .setTitle(`Musix ${error.toString()}`)
                .setDescription(error.stack.replace(/at /g, '**at **'))
                .setColor('#b50002');
            client.fetchUser('360363051792203779').then(user => user.send(embed)).catch(console.error);
        }
    }
}
