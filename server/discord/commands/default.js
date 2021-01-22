const { default: axios } = require('axios');
const { of } = require('await-of');
const Fetcher = require('../../fetcher');
const Logger = require('../../utils/logger');
const Maps = require('../../utils/maps');
const { getBotResult, GAS_TYPE, GAS_MSG_DICT } = require('../../utils/messages');

/**
 * No command.
 * @param  {Discord.Message} message
 * @param  {Array<String>} args
 */
module.exports = async function defaultCommand(message, args = []) {
  const [place, , product = 'regular'] = args;
  let [, distance = 10] = args;
  let selectedProduct = GAS_TYPE.regular;

  distance = parseInt(distance, 10);

  if (Number.isNaN(distance) || distance % 1 !== 0) {
    await message.reply('😾 La distancia debe ser un numero entero.');
    return;
  }

  if (distance < 1 || distance > 15) {
    await message.reply('🙀 La distancia debe ser un número entero entre 1 y 15 (Kilómetros).');
    return;
  }

  distance *= 1000; // A metros

  if (GAS_MSG_DICT[product.toLowerCase()]) {
    selectedProduct = GAS_MSG_DICT[product.toLowerCase()];
  }

  const newMsg = await message.reply('😺 Consultando precios. Estoy eligiendo los más baratos.');
  let latitude = process.env.DEFAULT_LATITUDE || 29.0729673;
  let longitude = process.env.DEFAULT_LONGITUDE || -110.9559192;

  if (place) {
    if (Maps.isCoords.test(place)) { // Si es una coordenada.
      ([latitude, longitude] = place.split(','));
    } else {
      const [autoResp, autoError] = await of(axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: {
          key: process.env.GOOGLE_MAP_KEY,
          components: 'country:mx',
          input: place,
        },
      }));
      if (autoError) {
        Logger.error(autoError);
        await newMsg.edit('😿 Hubo un error: No encontré el lugar.');
        return;
      }
      const { data: { status, predictions } } = autoResp;
      if (status !== 'OK') {
        Logger.error(new Error(`${status}: ${autoResp.data.error_message}`));
        await newMsg.edit(`😿 Hubo un error: No encontré el lugar \`${place}\`. Intenta con otra dirección.`);
        return;
      }
      const { place_id: placeId } = predictions[0];
      // Hacer la llamada de places.
      const [geoResp, geoError] = await Maps.GeocodePlace(placeId);
      if (geoError) {
        Logger.error(geoError);
        await newMsg.edit('😿 Hubo un error: No encontré el lugar.');
        return;
      }
      const { status: stats, results: [address] } = geoResp.data;
      if (stats !== 'OK') {
        Logger.error(new Error(`${stats}: ${geoResp.data.error_message}`));
        await newMsg.edit(`😿 Hubo un error: No encontré el lugar \`${place}\`. Intenta con otra dirección.`);
        return;
      }
      ({ lat: latitude, lng: longitude } = address.geometry.location);

      await Promise.all([
        newMsg.edit(`😸 Ya encontré el lugar. Obtendré las estaciones.\n🌎: \`${address.formatted_address}\`\n📍: \`${latitude},${longitude}\`.\n🗺: <https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}>`),
        message.react('✅'),
      ]);
    }
  }
  // Demás
  const [response, error] = await of(Fetcher.getGasStations(
    latitude, longitude,
    distance,
    selectedProduct.product_id,
  ));
  if (error) {
    Logger.error(error);
    await newMsg.edit('😿 Hubo un error: API No se pudo contactar.');
    return;
  }
  const botMessage = getBotResult(response, selectedProduct.key);
  await message.reply(botMessage);
};
