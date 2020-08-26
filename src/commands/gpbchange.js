module.exports = {
    name: "gpbchange",
    desc: "Changes the time interval between posture reminders.",
    permission: 2,
    func: (client, channel, tags, reminder, time) => {
        // catch invalid time intervals
        if(isNaN(time) || time < 15 || time > 60) {
            client.say(channel, `@${tags.username}, invalid time interval. Enter a number between 15 and 60`);
        }
        else {
            // set interval to appropriate time (minutes to milliseconds)
            reminder.interval = time * 60 * 1000;
            
            /**
             * if reminders are active, restart timeout with updated interval.
             * otherwise, just notify user of change.
             */
            if (reminder.timeoutId._idleTimeout !== -1) {
                clearTimeout(reminder.timeoutId);
                reminder.timeoutId = setTimeout(reminder.func, reminder.interval, channel);
                client.say(channel, `@${tags.username}, reminders restarted with time interval of ${time} minutes.`);
            }
            else {
                client.say(channel, `@${tags.username}, time interval changed to ${time} minutes.`);
            }

        }
    }
}