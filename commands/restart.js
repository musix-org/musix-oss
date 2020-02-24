module.exports = {
    name: 'restart',
    alias: 'none',
    usage: '',
    description: 'Restart the bot',
    onlyDev: true,
    permission: 'none',
    category: 'util',
    async execute(msg, args, client, Discord, prefix, command) {
        client.destroy()
        const MusicClient = require('../struct/client.js');
        const newClient = new MusicClient({});
        msg.channel.send('restarted!');
    }
};
