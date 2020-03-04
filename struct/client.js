const { Client, Collection } = require('discord.js');
const Discord = require('discord.js');
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccount.json');
const fs = require('fs');
const path = require('path')
const events = '../events/';

module.exports = class extends Client {
    constructor() {
        super({
            disableEveryone: true,
            disabledEvents: ['TYPING_START']
        });
        this.commands = new Collection();
        this.commandAliases = new Collection();
        this.settingCmd = new Collection();
        this.queue = new Map();
        this.funcs = {};
        this.dispatcher = {};
        this.config = require('./config/config.js');
        this.dispatcher.finish = require('../events/dispatcher/finish.js');

        fs.readdirSync(path.join(__dirname, 'funcs')).forEach(filename => {
            this.funcs[filename.slice(0, -3)] = require(`./funcs/${filename}`);
        });

        const commandFiles = fs.readdirSync(path.join(path.dirname(__dirname), 'commands')).filter(f => f.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            command.uses = 0;
            this.commands.set(command.name, command);
            this.commandAliases.set(command.alias, command);
        }
        const settingFiles = fs.readdirSync(path.join(path.dirname(__dirname), 'commands/settings')).filter(f => f.endsWith('.js'));
        for (const file of settingFiles) {
            const option = require(`../commands/settings/${file}`);
            this.settingCmd.set(option.name, option);
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        this.db = admin.firestore();

        this.global = {
            db: {
                guilds: {},
            },
        };

        this.db.FieldValue = require('firebase-admin').firestore.FieldValue;

        if (this.config.devMode) {
            this.config.token = this.config.devToken;
        }

        this.on('ready', () => {
            require(`${events}ready`).execute(this, Discord);
        });
        this.on('message', (msg) => {
            require(`${events}msg`).execute(this, msg, Discord);
        });
        this.on('guildCreate', (guild) => {
            require(`${events}guildCreate`).execute(this, guild);
        });
        this.on('voiceStateUpdate', (oldState, newState) => {
            require(`${events}voiceStateUpdate`).execute(this, oldState, newState);
        });
        this.on('error', (error) => {
            client.channels.fetch(client.config.debug_channel).send('Error: ' + error);
        });

        this.login(this.config.token).catch(err => console.log('Failed to login: ' + err));
    }
};
