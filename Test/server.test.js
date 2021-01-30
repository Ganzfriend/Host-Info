/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const app = require('../server.js');
const { Hosts, db } = require('../Database');

const request = supertest(app);

let req;

beforeAll(async (done) => {
  await Hosts.findByIdAndUpdate('60020bda53702f682cd8968c', { messages: [] });
  done();
});

afterAll(async (done) => {
  await db.connection.db.dropDatabase();
  db.disconnect();
  done();
});

describe('server endpoints', () => {
  req = (endpoint) => request.get(endpoint);
  const endpoint = 15;

  describe('GET requests', () => {
    test('should return an OK status code with proper endpoint', async (done) => {
      const res = await req(`/hostInfo/${endpoint}`);
      expect(res.status).toBe(200);
      done();
    });

    test('should return an empty body if bad endpoint', async (done) => {
      const res = await req('/JoeSchmoe');
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({});
      expect(res.error).toEqual(expect.any(Error));
      done();
    });

    test('should return specific data', async (done) => {
      const res = await req(`/hostInfo/${endpoint}`);
      expect(res.body).not.toBeNull();
      expect(res.body.name).toBe('Jon Lasley');
      done();
    });

    test('should return nested properties', async (done) => {
      const res = await req(`/toKnow/${endpoint}`);
      expect(res.body).not.toBeNull();
      expect(res.body).toHaveProperty('health');
      expect(res.body.health).toHaveProperty('safety');
      done();
    });

    test('should check for a user with no messages', async (done) => {
      const res = await req(`/hostInfo/${endpoint}`);
      expect(res.body).toHaveProperty('messages');
      expect(res.body.messages).toHaveLength(0);
      done();
    });

    it('should return the location requested', async (done) => {
      const res = await req(`/location/${endpoint}`);
      expect(res.status).toBe(200);
      const { city, state, country } = res.body;
      const location = `${city}, ${state}, ${country}`;
      expect(location).toBe('Austin, Texas, United States');
      done();
    });
  });

  describe('PUT requests', () => {
    test('should be able to update a users messages property', async (done) => {
      let res = await req(`/hostInfo/${endpoint}`);
      expect(res.body.messages).toHaveLength(0);
      const id = res.body._id;
      res = await request.put(`/email/${id}`).send({ user: 'aflatness', message: 'This is from the test' });
      expect(res.status).toBe(202);
      done();
    });

    test('should return a messages property with a value inside', async (done) => {
      const res = await req(`/hostInfo/${endpoint}`);
      expect(res.body).toHaveProperty('messages');
      expect(res.body.messages).toHaveLength(1);
      const obj = res.body.messages[0];
      expect(obj).toHaveProperty('message');
      expect(obj.message).toEqual(expect.any(String));
      done();
    });

    it('should return an error if no matching id found', async (done) => {
      const res = await request.put('/email/12345').send({ user: 'aflatness', message: 'This is from the test' });
      expect(res.status).toBe(404);
      expect(res.error).toEqual(expect.any(Error));
      done();
    });
  });
});
