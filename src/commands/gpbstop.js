module.exports = {
    name: "gpbstop",
    desc: "Stops posture reminders.",
    permission: 2,
    func: (client, channel, tags, reminder, _time) => {
        // if reminders are stopped, notify user of no change. else, stop them.
		if (reminder.timeoutId._idleTimeout === -1) {
			client.say(channel, `@${tags.username}, posture reminders already stopped.`);
		}
		else {
			clearTimeout(reminder.timeoutId);
			client.say(channel, `@${tags.username}, posture reminders stopped.`);
		}
	}
}