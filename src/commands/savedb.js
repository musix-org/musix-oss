module.exports = {
    name: 'savedb',
    alias: 'save',
    usage: '',
    description: 'save the database',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, command) {
        client.funcs.saveDB(client);
        msg.channel.send(client.messages.dbSaved);
    }
};
