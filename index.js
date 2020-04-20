const config = require("./config/config.js");
/*const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccount.json");
const secondaryAppConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://global-1f5f9.firebaseio.com",
};
const secondary = admin.initializeApp(secondaryAppConfig, "secondary");
const globaldb = secondary.database();
const global = {
  db: {
    guilds: {},
  },
};*/

if (config.devMode) {
  console.log("- dev mode- ");
  config.token = config.devToken;
  config.shards = 1;
}

const {
  ShardingManager
} = require("discord.js");
const manager = new ShardingManager("./src/bot.js", {
  token: config.token,
  respawn: config.respawn,
  totalShards: config.shards,
});

console.log("- Launching shards -");
manager.spawn(config.shards, config.shardDelay, config.shardTimeout);
manager.on("shardCreate", (shard) =>
  console.log(`- Launched shard ${shard.id} -`)
);