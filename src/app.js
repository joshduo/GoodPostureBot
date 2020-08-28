const tmi = require('tmi.js');
const cfg = require('./config.js');
const cmds = require('./commands/commands.js');
const { permission } = require('./commands/hello.js');

// create client with channel to join
const client = new tmi.Client({
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: cfg.twitch.username,
        password: cfg.twitch.oauthToken
    },
    channels: cfg.twitch.channels
});

// create posture reminder with default fields and reminder function 
var reminder = {
    interval: 5000,
    timeoutId: null,
    func: (channel) => {
        client.say(channel, "Sit up straight, bro.");
        reminder.timeoutId = setTimeout(reminder.func, reminder.interval, 
                channel);
    }
}

/**
 * check if user has permission to use the command
 */
async function getPermission(command, badges) {
    var permissionLevel = cmds[command].permission;

    /**
     * permission levels for commands:
     *  - 0: disabled
     *  - 1: all users
     *  - 2: mods/broadcaster
     *  - 3: broadcaster only
     */
    switch(permissionLevel) {
        case 0:
            return false;
        case 1:
            return true;
        case 2:
            if (badges != null && 
                (badges.moderator === '1' || badges.broadcaster === '1')) {
                return true;
            }
            else {
                return false;
            }
        case 3:
            if (badges != null && badges.broadcaster === '1') {
                return true;
            }
            else {
                return false;
            }
    }
}

// connect to Twitch
client.connect().catch(console.error);

// start sending messages when the client connects to the channel
client.on('join', (channel, username, isSelf) => {
    if(!isSelf) return;
    reminder.timeoutId = setTimeout(reminder.func, reminder.interval, channel);
}) 

// read chat for commands
client.on('message', (channel, tags, message, isSelf) => {
    if(isSelf) return;
    if(!message.startsWith(cfg.twitch.prefix)) return;

    console.log(tags);

    var msgparts = message.toLowerCase().split(/[ ]+/);
    var command = msgparts[0];
    var commandName = command.split(cfg.twitch.prefix)[1];

    // if the command exists, check if user has permission then run if so
    if (cmds.hasOwnProperty(commandName)) {
        let time = msgparts[1];
        getPermission(commandName, tags.badges).then(allowed => {
            // only run the command if the user is allowed to
            if (allowed) {
                cmds[commandName].func(client, channel, tags, reminder, time);

                // log command if enabled in cfg
                if (cfg.options.commandLogging) {
                    console.log(`User ${tags.username} executed command` +
                            ` ${command}. Complete message: \n${message}`)
                }
            }
        });
    }
});