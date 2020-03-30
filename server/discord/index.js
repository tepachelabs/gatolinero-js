const Discord = require('discord.js');
const Logger = require('../utils/logger');
const { GAS_MSG_DICT } = require('../utils/messages');

const { TOKEN_DISCORD, DISCORD_PREFIX = '!gato' } = process.env;
const client = new Discord.Client();

/* Commands */
const defaultCommand = require('./commands/default');

client.on('error', (error) => {
  Logger.error(error);
});

client.on('ready', () => {
  Logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', async function onMessage(message) {
  if (message.author.bot) return;
  if (message.content.indexOf(DISCORD_PREFIX) !== 0) return;
  const args = [...message.content.slice(DISCORD_PREFIX.length).trim().matchAll(/(?:')(?:.+?)(?:')|(?:")(.+?)(?:")|(?:“)(.+?)(?:”)|\S+/g)].map((item) => (item[1] || item[0]));
  if (!args.length) {
    await message.reply(`Por favor, usa: \`${DISCORD_PREFIX} lugar distancia ${Object.keys(GAS_MSG_DICT).join('|')}\`, ejemplo: \`${DISCORD_PREFIX} "Hermosillo, Sonora" 10 regular\``);
    return;
  }
  switch (args[0]) {
    default:
      await defaultCommand(message, args);
  }
});

client.login(TOKEN_DISCORD)
  .then(() => {
    Logger.info('Discord login.');
  })
  .catch((error) => {
    Logger.error(error);
  });

module.exports = client;
