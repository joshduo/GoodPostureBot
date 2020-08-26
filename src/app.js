const tmi = require('tmi.js');
const cfg = require('./config.js');
const cmds = require('./commands/commands.js');

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
		reminder.timeoutId = setTimeout(reminder.func, reminder.interval, channel);
	}
}

/**
 * get the permission level of a user based on their badges
 * 	- 1: not mod/broadcaster
 * 	- 2: mod/broadcaster
 * 	- 3: broadcaster only
 */

 /*
function getPermission(badges) {
	console.log(badges);

	if (badges === null) {
		console.log("this is a normal user");
	}
	else if (badges.moderator === '1') {
		console.log("this is a mod");
	}
	else if (badges.broadcaster === '1') {
		console.log("this is a broadcaster");
	}
	else {
		console.log("this is anyone else");
	}
}
*/

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

	getPermission(tags.badges);

	var msgparts = message.toLowerCase().split(/[ ]+/);
	var command = msgparts[0];
	var commandName = command.split(cfg.twitch.prefix)[1];

	// run command if it exists
	if (cmds.hasOwnProperty(commandName)) {
		let time = msgparts[1];
		cmds[commandName].func(client, channel, tags, reminder, time);
	}
});