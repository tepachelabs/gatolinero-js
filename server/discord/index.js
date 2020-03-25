const Discord = require('discord.js');
const { of } = require('await-of');
const Logger = require('../utils/logger');
const Fetcher = require('../fetcher');

const { TOKEN_DISCORD, DISCORD_PREFIX = '!gato' } = process.env;
const client = new Discord.Client();

client.on('error', (error) => {
  Logger.error(error);
});

client.on('ready', () => {
  Logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', async function onMessage(message) {
  if (message.content.indexOf(DISCORD_PREFIX) !== 0) return;
  const args = message.content.slice(DISCORD_PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const newMsg = await message.reply('Fierro, awanta en lo que obtengo la información...');
  const [response, error] = await of(Fetcher.getEstaciones());
  if (error) {
    Logger.error(error);
    await newMsg.edit('El API me dio error compa 😅.');
    return;
  }
  response.sort((itemA, itemB) => itemA.Regular - itemB.Regular);
  const top5 = response.slice(0, 5).map((item) => {
    const info = JSON.parse(item.EstacionServicioDetalle);
    return `**${info.RazonSocial}**\n\t**Regular:** ${item.Regular.toFixed(2)}\t**Premium**: ${item.Premium.toFixed(2)}\n\t**Dirección**: ${info.Calle}, ${info.Colonia} ${info.CodigoPostal}\n\t**Mapa**: <https://www.google.com/maps/search/?api=1&query=${info.Latitud},${info.Longitude}>`;
  }).join('\n');
  await newMsg.edit(`Gasofas mas baras: \n${top5}`);
});

client.login(TOKEN_DISCORD)
  .then(() => {
    Logger.info('Discord login.');
  })
  .catch((error) => {
    Logger.error(error);
  });

module.exports = client;
