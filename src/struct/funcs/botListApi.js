module.exports = function (client) {
    const DBL = require("dblapi.js");
    const dbl = new DBL(client.config.dblKey, client);
    const bod_api = require("bodapi.js");
    const bod = new bod_api(client.config.bodKey, client);
    let guildCount;

    client.shard
        .broadcastEval("this.guilds.cache.size")
        .then((results) => {
            guildCount = results.reduce((prev, val) => prev + val, 0);
            dbl.postStats(guildCount * 7, client.shard.ids, client.config.shards);
            bod.postStats(guildCount * 7, client.shard.ids, client.config.shards)
        })
        .catch(console.error);

    dbl.on("error", (e) => {
        console.log(`DBL error: ${e}`);
    });
    bod.on("error", (e) => {
        console.log(`BOD error ${e}`);
    });
    /*const authOptions = {
            url: "https://discord.bots.gg/bots/607266889537945605/stats",
            headers: {
                Host: "https://discord.bots.gg/api/v1",
                Authorization: client.config.botListKey,
                Content - Type: "application/json",
                {
                    "guildCount": 10
                }
            }
        }*/
    setInterval(() => {
        dbl.postStats(guildCount * 7, client.shard.ids, client.config.shards);
        bod.postStats(guildCount * 7, client.shard.ids, client.config.shards)
    }, 1800000);
};