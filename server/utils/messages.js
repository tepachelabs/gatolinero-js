
exports.getBotResult = function getBotResult(data = [], key = 'Regular') {
  return data.filter((item) => !!item[key])
    .sort((itemA, itemB) => itemA[key] - itemB[key])
    .slice(0, 5).map((item) => {
      const info = JSON.parse(item.EstacionServicioDetalle);
      const hasDiesel = (item.Diesel && `\t**Diesel**: ${(item.Diesel || 0).toFixed(2)}`) || '\n\t**Diesel no disponible.**';
      return `**${info.RazonSocial}**\n\t**Regular:** ${(item.Regular || 0).toFixed(2)}\t**Premium**: ${(item.Premium || 0).toFixed(2)}${hasDiesel}\n\t**Dirección**: ${info.Calle}, ${info.Colonia} ${info.CodigoPostal}\n\t**Mapa**: <https://www.google.com/maps/search/?api=1&query=${info.Latitud},${info.Longitude}>`;
    })
    .join('\n\n');
};

const GAS_TYPE = {
  regular: {
    key: 'Regular',
    product_id: 13,
  },
  premium: {
    key: 'Premium',
    product_id: 14,
  },
  diesel: {
    key: 'Diesel',
    product_id: 16,
  },
};

exports.GAS_TYPE = GAS_TYPE;

const GAS_MSG_DICT = {
  normal: GAS_TYPE.regular,
  regular: GAS_TYPE.regular,
  verde: GAS_TYPE.regular,
  premium: GAS_TYPE.premium,
  roja: GAS_TYPE.premium,
  diesel: GAS_TYPE.diesel,
};

exports.GAS_MSG_DICT = GAS_MSG_DICT;
