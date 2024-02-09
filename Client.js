const { Client, Collection } = require('discord.js');
const admin = require('firebase-admin');
require('dotenv/config');

module.exports = class extends Client {
    constructor() {
        super({
            intents: [
                "Guilds",
                "GuildMessages",
                "GuildVoiceStates",
                "MessageContent"
            ],
            disableMentions: "everyone",
            disabledEvents: ["TYPING_START"]
        });

        this.commands = new Collection();

        this.commandAliases = new Collection();

        this.playlistCmd = new Collection();

        this.settingCmd = new Collection();

        this.events = new Collection();

        this.queue = new Map();

        this.funcs = {};

        this.funcs.handleVideo = require('./funcs/handleVideo.js');
        this.funcs.play = require('./funcs/play.js');
        this.funcs.msToTime = require('./funcs/msToTime.js');
        this.funcs.exe = require('./funcs/exe.js');

        this.config = require('./config.js');

        this.global = {
            db: {
                guilds: {},
                playlists: {},
            },
        };

        if(this.config.firebase.serviceAccount){
            this.funcs.dbget = require('./funcs/dbget.js');

            admin.initializeApp({
                credential: admin.credential.cert(this.config.firebase.serviceAccount),
            });

            this.db = admin.firestore();

            this.db.FieldValue = require('firebase-admin').firestore.FieldValue;
        }
    }
};
