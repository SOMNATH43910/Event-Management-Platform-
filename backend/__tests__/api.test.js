const request = require('supertest');
const { app, httpServer } = require('../server');

// Helper to register a user and get token
async function registerUser(username, password = 'Test1234!', email) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username, password, email: email || `${username}@test.com` });
  return res;
}

afterAll((done) => {
  if (httpServer.listening) {
    httpServer.close(done);
  } else {
    done();
  }
});

describe('Auth Routes', () => {
  const user = { username: `authuser_${Date.now()}`, password: 'Password1!', email: 'auth@test.com' };

  test('POST /api/auth/register - success', async () => {
    const res = await registerUser(user.username, user.password, user.email);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(user.username);
  });

  test('POST /api/auth/register - duplicate username', async () => {
    const res = await registerUser(user.username, user.password, user.email);
    expect(res.status).toBe(409);
  });

  test('POST /api/auth/register - missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'x' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login - success', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: user.username, password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login - non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'doesnotexist', password: 'pass' });
    expect(res.status).toBe(401);
  });
});

describe('Events Routes', () => {
  let token;
  let createdEventId;
  const username = `evtuser_${Date.now()}`;

  beforeAll(async () => {
    const res = await registerUser(username);
    token = res.body.token;
  });

  test('GET /api/events - returns array', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/events - unauthenticated', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ title: 'Test', date: '2026-01-01', location: 'NYC' });
    expect(res.status).toBe(401);
  });

  test('POST /api/events - creates event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Event', date: '2026-06-01', location: 'NYC', description: 'A test event', capacity: 50 });
    expect(res.status).toBe(201);
    expect(res.body.event.title).toBe('My Event');
    createdEventId = res.body.event.id;
  });

  test('GET /api/events/:id - returns event', async () => {
    const res = await request(app).get(`/api/events/${createdEventId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdEventId);
  });

  test('GET /api/events/:id - not found', async () => {
    const res = await request(app).get('/api/events/nonexistent-id');
    expect(res.status).toBe(404);
  });

  test('PUT /api/events/:id - updates event', async () => {
    const res = await request(app)
      .put(`/api/events/${createdEventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Event', status: 'ongoing' });
    expect(res.status).toBe(200);
    expect(res.body.event.title).toBe('Updated Event');
    expect(res.body.event.status).toBe('ongoing');
  });

  test('POST /api/events/:id/register - registers user', async () => {
    const res = await request(app)
      .post(`/api/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.registrationCount).toBe(1);
  });

  test('POST /api/events/:id/register - duplicate registration', async () => {
    const res = await request(app)
      .post(`/api/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(409);
  });

  test('DELETE /api/events/:id/register - cancels registration', async () => {
    const res = await request(app)
      .delete(`/api/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.registrationCount).toBe(0);
  });

  test('DELETE /api/events/:id - deletes event', async () => {
    const res = await request(app)
      .delete(`/api/events/${createdEventId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/health - health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
