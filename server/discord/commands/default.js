const { default: axios } = require('axios');
const { of } = require('await-of');
const Fetcher = require('../../fetcher');
const Logger = require('../../utils/logger');
const Maps = require('../../utils/maps');

/**
 * No command.
 * @param  {Discord.Message} message
 * @param  {Array<String>} args
 */
module.exports = async function defaultCommand(message, args = []) {
  const [place] = args;
  let [, distance = 10000] = args;
  if (Number.isNaN(distance)) {
    distance = parseInt(distance, 10);
    await message.reply('La distancia debe ser un numero.');
    if (distance < 100 || distance > 15000) {
      await message.reply('La distancia no debe ser menor a 100 metros y mayor a 15km.');
    }
    return;
  }
  const newMsg = await message.reply('Obteniendo información, un momento...');
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
        await newMsg.edit('Lo siento, hubo un problema al buscar el lugar 😩');
        return;
      }
      const { data: { status, predictions } } = autoResp;
      if (status !== 'OK') {
        await newMsg.edit(`Lo siento, No encontré el lugar \`${place}\` 😩. Intenta con otra dirección.`);
        return;
      }
      const { place_id: placeId } = predictions[0];
      // Hacer la llamada de places.
      const [geoResp, geoError] = await Maps.GeocodePlace(placeId);
      if (geoError) {
        await newMsg.edit('Lo siento, hubo un problema al buscar el lugar 😩');
        return;
      }
      const { status: stats, results: [address] } = geoResp.data;
      if (stats !== 'OK') {
        await newMsg.edit(`Lo siento, No encontré el lugar \`${place}\` 😩. Intenta con otra dirección.`);
        return;
      }
      ({ lat: latitude, lng: longitude } = address.geometry.location);

      await Promise.all([
        newMsg.edit(`Ya encontré el lugar. Obtendré las estaciones.\nLugar: \`${address.formatted_address}\`\nCoordenadas: \`${latitude},${longitude}\`.\nMapa: <https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}>`),
        message.react('✅'),
      ]);
    }
  }
  // Demás
  const [response, error] = await of(Fetcher.getEstaciones(
    latitude, longitude,
    distance,
  ));
  if (error) {
    Logger.error(error);
    await newMsg.edit('El API de obtener estaciones me dio error 😩.');
    return;
  }
  const filtered = response.filter((item) => item.Regular !== 0).sort((itemA, itemB) => itemA.Regular - itemB.Regular);
  const top5 = filtered.slice(0, 5).map((item) => {
    const info = JSON.parse(item.EstacionServicioDetalle);
    return `**${info.RazonSocial}**\n\t**Regular:** ${(item.Regular || 0).toFixed(2)}\t**Premium**: ${(item.Premium || 0).toFixed(2)}\n\t**Dirección**: ${info.Calle}, ${info.Colonia} ${info.CodigoPostal}\n\t**Mapa**: <https://www.google.com/maps/search/?api=1&query=${info.Latitud},${info.Longitude}>`;
  }).join('\n');
  await message.reply(`Gasofas mas baras: \n${top5}`);
};
