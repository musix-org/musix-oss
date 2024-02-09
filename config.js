module.exports = {
    discord_api_token: process.env.DISCORD_API_TOKEN,
    firebase: {
        serviceAccount: null
        //serviceAccount: require('./serviceAccount.json')
    },
    youtube_api_key: process.env.YOUTUBE_API_KEY,
    prefix: process.env.BOT_PREFIX ?? "mx>",
    embedColor: "#b50002"
}
