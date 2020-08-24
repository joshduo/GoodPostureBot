const tmi = require('tmi.js');

// create client with channel to join
const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: '',
		password: ''
	},
	channels: [ '' ]
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
