/**
 * Command format:
 * 
 * name: command name
 * desc: description
 * permission: permission levels
 *      - 0: disabled
 *      - 1: allowed for all users
 *      - 2: allowed for mods/broadcaster
 *      - 3: allowed for broadcaster only
 * func: function
 * 
 * Reference(s):
 *  - https://github.com/dustinrouillard/spotify-twitch-bot for formatting inspo
 *
 */

// compile all command modules into one object
module.exports = {
    hello: require('./hello.js'),
    gpbchange: require('./gpbchange.js'),
    gpbstart: require('./gpbstart.js'),
    gpbstop: require('./gpbstop.js'),
}