const Telegraf = require('telegraf');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const session = require('telegraf/session');

const { of } = require('await-of');
const Logger = require('../utils/logger');
const { getBotResult, GAS_TYPE } = require('../utils/messages');
const Fetcher = require('../fetcher');


const { TOKEN_TELEGRAM } = process.env;

const bot = new Telegraf(TOKEN_TELEGRAM);

async function botGetEstaciones(ctx) {
  await ctx.reply('Muy bien, ahora buscaré las estaciones mas cercanas 😺');
  const [response, error] = await of(Fetcher.getEstaciones(
    ctx.scene.state.latitude,
    ctx.scene.state.longitude,
    ctx.scene.state.distance,
    ctx.scene.state.gas_type.product_id,
  ));
  if (error) {
    Logger.error(error);
    await ctx.reply('El API de obtener estaciones me dio error 😿.');
    return ctx.scene.leave();
  }
  const botMessage = getBotResult(response, ctx.scene.state.gas_type.key);
  await ctx.replyWithMarkdown(botMessage);
  return ctx.scene.leave();
}

const gasWizard = new WizardScene('gas_wizard',
  (ctx) => {
    const { from: { id } } = (ctx.update.callback_query || ctx.update.message);
    ctx.scene.state.user_id = id;
    ctx.reply('⛽ ¿Qué tipo de gasolina te gustaría buscar?', Markup.inlineKeyboard([
      Markup.callbackButton('Regular 💸', 'regular'),
      Markup.callbackButton('Premium 💰', 'premium'),
      Markup.callbackButton('Diesel 💵', 'diesel'),
      Markup.callbackButton('Así mero 🤔', 'gas_default'),
    ]).extra());
    return ctx.wizard.next();
  },
  (ctx) => {
    if (!ctx.update.callback_query) {
      return ctx.reply('Selecciona una de los tipos de gasolina de los botones por favor. 🙀');
    }
    const { data: button } = ctx.update.callback_query;
    if (!button) {
      return ctx.reply('Selecciona una de los tipos de gasolina de los botones por favor. 🙀');
    }
    if (button === 'gas_default') {
      ctx.scene.state.gas_type = GAS_TYPE.regular;
      ctx.scene.state.distance = 10000;
      return botGetEstaciones(ctx);
    }
    ctx.scene.state.gas_type = GAS_TYPE[button];
    ctx.replyWithMarkdown(`Muy bien, elegiste **${GAS_TYPE[button].key}**. \n¿A cuántos kilometros te gustaría buscar? Escribe la cantidad solamente. Ejemplo: \`5\` para 5km.`);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const distance = parseInt(ctx.message.text, 10);
    if (Number.isNaN(distance)) {
      return ctx.reply('Esta distancia es inválida.');
    }
    if (distance < 1 || distance > 15) {
      return ctx.reply('La distancia no debe ser menor a 1km o mayor a 15km.');
    }
    ctx.scene.state.distance = distance * 1000;
    return botGetEstaciones(ctx);
  });

const stage = new Stage([gasWizard]);
/* Middlewares */
bot.use(session());
bot.use(stage.middleware());
bot.catch(async function onError(error) {
  Logger.error(error);
});

/* Mensaje inicial de bienvenida. */
bot.start((ctx) => ctx.reply('😺 Bienvenido al Gatolinero. Envíame tu ubicación para obtener estaciones.'));

bot.on('message', async (ctx) => {
  if (!ctx.update) return;
  const { message } = ctx.update;
  if (message.from.is_bot) return; // Ignore bots.
  if (message.location) { // Envío un lugar para sacar.
    ctx.state = { ...message.location };
    ctx.scene.enter('gas_wizard', ctx.state);
  }
});

bot.launch()
  .then(() => {
    Logger.info('* Telegram bot [ONLINE].');
  }).catch((error) => {
    Logger.info('* Error on Telegram');
    Logger.error(error);
  });

module.exports = bot;
