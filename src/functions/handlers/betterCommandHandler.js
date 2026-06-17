const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    async function func(filePath) {
      if (filePath.endsWith(".js")) {
        const command = require(`../../../${filePath}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
        console.log(
          `Command: ${command.data.name} has passed through the handler.`
        );
      } else {
        const files = fs.readdirSync(filePath);
        files.forEach((f) => {
          func(`${filePath}/${f}`);
        });
      }
    }
    func(`src/commands`);
    const { clientID, guildID } = require("../../../control.json");

    const rest = new REST({ version: "9" }).setToken(process.env.token);
    try {
      await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
        body: client.commandArray,
      });
    } catch (error) {
      console.error(error);
    }
  };
};
