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
		password: cfg.twitch.oauth_token
	},
	channels: cfg.twitch.channels
});

// connect to Twitch
client.connect().catch(console.error);

// start sending messages when the client connects to the channel
client.on('join', (channel, username, isSelf) => {
	if(!isSelf) return;
	setInterval(() => client.say(channel, "Sit up straight, bro."), 5000);
}) 

// example message response
client.on('message', (channel, tags, message, self) => {
	if(self) return;
	if(message.toLowerCase() === '!hello') {
		client.say(channel, `@${tags.username}, heya!`);
		console.log(channel);
	}
});
