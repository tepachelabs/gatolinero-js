
const { getGasStations } = require('#fetcher');
/**
 * @typedef {import("koa").Context} Context
 */

/**
 * @param {Context} ctx
 */
async function getStations(ctx) {
  const {
    latitude, longitude, distance, product,
  } = ctx.query;
  const response = await getGasStations(latitude, longitude, distance, product);
  // TODO: Do-something with result async to the response.

  // Return response
  return ctx.ok(response);
}

module.exports = {
  getStations,
};
