module.exports = {
    name: "gpbstart",
    desc: "Starts posture reminders on the previously set time interval.",
    permission: 2,
    func: (client, channel, tags, reminder, time) => {
        // if reminders are stopped, start them. else, notify user of no change
        if (reminder.timeoutId._idleTimeout === -1) {
            reminder.timeoutId = setTimeout(reminder.func, reminder.interval, channel);
            client.say(channel, `@${tags.username}, posture reminders started. Reminding every ${time} minutes.`);
        }
        else {
            client.say(channel, `@${tags.username}, posture reminders already started.`);
        }
    }
}