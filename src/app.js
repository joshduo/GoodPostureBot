const tmi = require('tmi.js');
const cfg = require('./config.js');

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

var interval = 5000;	// time interval between posture reminders
var timeoutId;			// id of setTimeout() for use with clearTimeout()

// repeat posture message on interval
function remindPosture(channel) {
	client.say(channel, "Sit up straight, bro.");
	timeoutId = setTimeout(remindPosture, interval, channel);
}

/**
 * get the permission level of a user based on their badges
 * 	- moderator, broadcaster, other
 */
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

// connect to Twitch
client.connect().catch(console.error);

// start sending messages when the client connects to the channel
client.on('join', (channel, username, isSelf) => {
	if(!isSelf) return;
	timeoutId = setTimeout(remindPosture, interval, channel);
}) 

// read chat for commands
client.on('message', (channel, tags, message, isSelf) => {
	if(isSelf) return;
	if(!message.startsWith("!")) return;

	getPermission(tags.badges);

	var msgparts = message.split(/[ ]+/);
	var command = msgparts[0];

	// TODO MOVE COMMANDS TO A SEPARATE FILE
	// example greeting command
	if(command === '!hello') {
		client.say(channel, `@${tags.username}, heya!`);
		console.log(channel);
	}
	// change time interval to send messages (in minutes for now)
	else if(command === '!gpbchange') {
		let time = msgparts[1];
		
		// catch invalid time inttervals
		if(isNaN(time) || time < 15 || time > 60) {
			client.say(channel, `@${tags.username}, invalid time interval. Enter a number between 15 and 60`);
		}
		else {
			// set interval to time in ms
			interval = time * 60 * 1000;

			// restart timeout for posture messages with updated interval
			clearTimeout(timeoutId);
			timeoutId = setTimeout(remindPosture, interval, channel);
			client.say(channel, `@${tags.username}, time interval changed to ${time} minutes.`);
		}
	}
	// stop posture reminders
	else if (command === '!gpbstop') {
		if (timeoutId._idleTimeout === -1) {
			client.say(channel, `@${tags.username}, posture reminders already stopped.`);
		}
		else {
			clearTimeout(timeoutId);
			client.say(channel, `@${tags.username}, posture reminders stopped.`);
		}

	}
	// start posture reminders
	else if (command === '!gpbstart') {
		if (timeoutId._idleTimeout === -1) {
			timeoutId = setTimeout(remindPosture, interval, channel);
			client.say(channel, `@${tags.username}, posture reminders started.`);
		}
		else {
			client.say(channel, `@${tags.username}, posture reminders already started.`);
		}
	}
});