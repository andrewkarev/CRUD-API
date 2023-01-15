import request from 'supertest';
import { createServer } from 'http';
import { app } from '../app';
import { IUser } from 'interfaces/IUser';
import { v4 } from 'uuid';

const mockServer = createServer(async (req, res) => await app.handleRequest(req, res));
const mockApp = request(mockServer);
const mockUser = { username: 'John Doe', age: 42, hobbies: ['dissappearing'] };

let newlyCreatedUser: IUser;

afterAll(() => mockServer.close());

describe('Scenario #1. Base CRUD API methods implementation', () => {
  it('should return an empty array on the first GET /api/users request', async () => {
    const response = await mockApp.get('/api/users');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return newly created user for the POST /api/users request', async () => {
    const response = await mockApp.post('/api/users').send(mockUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ ...mockUser, id: response.body.id });

    newlyCreatedUser = response.body;
  });

  it('should return an exact user on GET /api/users/:id request', async () => {
    const response = await mockApp.get(`/api/users/${newlyCreatedUser.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(newlyCreatedUser);
  });

  it('should update user info on PUT /api/users/:id request', async () => {
    const response = await mockApp.put(`/api/users/${newlyCreatedUser.id}`).send({ age: 30 });
    const updatedUser = { ...newlyCreatedUser, age: 30 };

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedUser);
  });

  it('should delete user on DELETE /api/users/:id request', async () => {
    const response = await mockApp.delete(`/api/users/${newlyCreatedUser.id}`);

    expect(response.statusCode).toBe(204);
  });
});

describe('Scenario #2. Response with error on attempt to reach user incorrect id', () => {
  const validUUID = v4();
  const notValidUUID = validUUID.split('-').join('');

  it('should response with 404 error on GET /api/users/:id request with valid UUID', async () => {
    const response = await mockApp.get(`/api/users/${validUUID}`);

    expect(response.statusCode).toBe(404);
  });

  it('should response with 400 error on GET /api/users/:id request with invalid UUID', async () => {
    const response = await mockApp.get(`/api/users/${notValidUUID}`);

    expect(response.statusCode).toBe(400);
  });

  it('should response with 404 error on PUT /api/users/:id request with valid UUID', async () => {
    const response = await mockApp.put(`/api/users/${validUUID}`).send({ age: 30 });

    expect(response.statusCode).toBe(404);
  });

  it('should response with 400 error on PUT /api/users/:id request with invalid UUID', async () => {
    const response = await mockApp.put(`/api/users/${notValidUUID}`).send({ age: 30 });

    expect(response.statusCode).toBe(400);
  });

  it('should response with 404 error on DELETE /api/users/:id request with valid UUID', async () => {
    const response = await mockApp.delete(`/api/users/${validUUID}`);

    expect(response.statusCode).toBe(404);
  });

  it('should response with 400 error on DELETE /api/users/:id request with invalid UUID', async () => {
    const response = await mockApp.delete(`/api/users/${notValidUUID}`);

    expect(response.statusCode).toBe(400);
  });
});

describe('Scenario #3. Response with error on lack of the required fields', () => {
  it('should response with 400 error on POST /api/users/ request with except of the "username" field', async () => {
    const partialUser: Partial<IUser> = { ...mockUser };
    delete partialUser['username'];
    const response = await mockApp.post('/api/users').send(partialUser);

    expect(response.statusCode).toBe(400);
  });

  it('should response with 400 error on POST /api/users/ request with except of the "age" field', async () => {
    const partialUser: Partial<IUser> = { ...mockUser };
    delete partialUser['age'];
    const response = await mockApp.post('/api/users').send(partialUser);

    expect(response.statusCode).toBe(400);
  });

  it('should response with 400 error on POST /api/users/ request with except of the "hobbies" field', async () => {
    const partialUser: Partial<IUser> = { ...mockUser };
    delete partialUser['hobbies'];
    const response = await mockApp.post('/api/users').send(partialUser);

    expect(response.statusCode).toBe(400);
  });
});

describe('Scenario #4. Response with error on attempt to reach none existing route', () => {
  it('should response with 404 error on GET request on the non-existing endpoint', async () => {
    const partialUser: Partial<IUser> = { ...mockUser };
    delete partialUser['username'];
    const response = await mockApp.get('/some-non/existing/resource');

    expect(response.statusCode).toBe(404);
  });
});
