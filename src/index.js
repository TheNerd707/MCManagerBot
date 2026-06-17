require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.GuildMember, Partials.User],
});

const fs = require("fs");

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

function fileR(file) {
  if (file.endsWith(".js")) {
    require(`../${file}`)(client);
    console.log(`File: ${file} has passed through the handler.`);
  } else {
    const files = fs.readdirSync(file);
    files.forEach((f) => {
      fileR(`${file}/${f}`);
    });
  }
}

fileR(`./src/functions`);

client.handleEvents();
client.handleComponents();
client.handleCommands();

client.login(process.env.token);
