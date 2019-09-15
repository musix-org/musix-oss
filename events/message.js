module.exports = {
    name: 'message',
    async execute(client, message) {
        const { Discord, RichEmbed } = require('discord.js');
        const fs = require('fs');
        if (message.author.bot || !message.guild) return;
        const prefix = client.global.db.musix_guilds[message.guild.id].musix_prefix;
        if (message.mentions.users.first()) {
            if (message.mentions.users.first().id === '607266889537945605') return message.channel.send(`My prefix on this server is \`${prefix}\` !`);
        }
        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).split(' ');
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
            command.execute(message, args, client, RichEmbed, prefix);
        } catch (error) {
            message.reply(':x: there was an error trying to execute that command!');
            const embed = new Discord.RichEmbed()
                .setTitle(`Musix ${error.toString()}`)
                .setDescription(error.stack.replace(/at /g, '**at **'))
                .setColor('#b50002');
            client.fetchUser('360363051792203779').then(user => user.send(embed)).catch(console.error);
        }
    }
}