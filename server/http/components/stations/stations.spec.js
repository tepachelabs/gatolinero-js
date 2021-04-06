const { expect } = require('chai');
const app = require('#test/http/setup');

describe('Stations', () => {
  it('should return stations without query params', async () => {
    const response = await app.get('/stations')
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).to.be.an('array');
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.include.key('Id');
  });

  it('should return stations with distance query params', async () => {
    const response = await app.get('/stations')
      .query({
        distance: 1000,
      })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).to.be.an('array');
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.include.key('Id');
  });

  it('should return stations with latitude and longitude query params', async () => {
    const response = await app.get('/stations')
      .query({
        latitude: 29.085798,
        longitude: -110.973783,
      })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).to.be.an('array');
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0]).to.include.key('Id');
  });

  it('should return zero stations results', async () => {
    const response = await app.get('/stations')
      .query({
        latitude: 0,
        longitude: 0,
        distance: 10,
      })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(response.body).to.be.an('array');
    expect(response.body[0]).to.be.an('object');
    expect(response.body[0].Id).to.be.eq(0);
  });

  it('should return bad request on validation error', () => app.get('/stations')
    .query({
      latitude: -180,
      longitude: -360,
      distance: -10,
    })
    .expect(400)
    .expect('Content-Type', /json/));
});
