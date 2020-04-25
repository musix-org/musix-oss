module.exports = function (client) {
    const DBL = require("dblapi.js");
    const dbl = new DBL(client.config.dblKey, client);
    const bod_api = require("bodapi.js");
    const bod = new bod_api("Your api token", client);

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
        dbl.postStats(
            client.guilds.cache.size,
            client.shard.ids,
            client.config.shards
        );
    }, 1800000);
};