const { default: axios } = require('axios');

const {
  CRE_API_ENDPOINT,
  USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
} = process.env;

async function getEstaciones(
  latitud = 29.075046,
  longitud = -110.959020,
  distanciaMetros = 10000, // 10km
  subproductoid = 13, // Verde
) {
  const response = await axios.get(`${CRE_API_ENDPOINT}/Estaciones`, {
    headers: {
      'X-Api-Version': '2.0.3',
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
    params: {
      latitud,
      longitud,
      distanciaMetros,
      subproductoid,
    },
  });
  return response.data;
}

module.exports = {
  getEstaciones,
};
