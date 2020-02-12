require('dotenv/config');

module.exports = {
    //credentials
    token: process.env.TOKEN,
    devToken: process.env.DEVTOKEN,
    dblKey: process.env.DBLKEY,
    api_key: process.env.GOOGLE_API_KEY,
    //channels
    debug_channel: "634718645188034560",
    primary_test_channel: "617633098296721409",
    secondary_test_channel: "570531724002328577",
    devId: "360363051792203779",
    //misc
    embedColor: "#b50002",
    invite: "https://discordapp.com/api/oauth2/authorize?client_id=607266889537945605&permissions=3427328&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3Fclient_id%3D607266889537945605%26%3Bscope%3Dbot%26%3Bpermissions%3D0&scope=bot",
    //Settings
    devMode: true,
    dblApi: false,
    saveDB: false,
    //db values
    prefix: ">",
    defaultVolume: 5,
    permissions: false,
    dj: false,
    djrole: null,
    startPlaying: true,
}
