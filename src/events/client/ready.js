const { ActivityType } = require('discord.js')
const chalk = require("chalk");
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setActivity({
            name: "your commands",
            type: ActivityType.LISTENING
        });
        console.log(chalk.greenBright("[Bot Status]: Connected"));
    }
}