// example command for testing

module.exports = {
    name: "hello",
    desc: "Greets the user who called the command.",
    permission: 1,
    func: (client, channel, tags, _reminder, _time) => {
		client.say(channel, `@${tags.username}, heya!`);
    }
}