module.exports = async function (client) {
    if (!client.guilds.cache.has(client.config.testServer)) return;
    try {
        await client.channels.fetch(client.config.secondary_test_channel)
            .then(x => x.join());
    } catch (error) {
        console.log(error);
    }
};