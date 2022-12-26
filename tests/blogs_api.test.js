const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const initialBlogsFixtures = require('./blogs_fixtures');
const Blog = require('../models/blog');

const api = supertest(app);

describe('blogs api', () => {
  test('returns notes as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns same number of notes as in fixtures', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogsFixtures.length);
  });

  test('returns content of first blog', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].title).toBe('React patterns');
  });

  test('returns blog id in such property', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(response.body[0]._id).not.toBeDefined();
  });

  test('correctly creates new blog', async () => {
    const response = await api.post('/api/blogs')
      .send({
        title: 'New blog',
        author: 'Test Author',
        url: 'google.com',
        likes: 0,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    const blogsResponse = await api.get('/api/blogs');

    expect(response.body.title).toBe('New blog');
    expect(blogsResponse.body.length).toBe(initialBlogsFixtures.length + 1);
  });

  test('creates new blog with zero likes', async () => {
    const response = await api.post('/api/blogs')
      .send({
        title: 'New blog without likes',
        author: 'Test author',
        url: 'google.com',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.likes).toBe(0);
  });

  test('returns 400 if no title or url', async () => {
    let response = await api.post('/api/blogs')
      .send({
        author: 'Test author',
        url: 'google.com',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.error).toContain('Blog validation failed: title');

    response = await api.post('/api/blogs')
      .send({
        title: 'Test title',
        author: 'Test author',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.error).toContain('Blog validation failed: url');
  });
});

beforeEach(async () => {
  await Blog.deleteMany({});

  // eslint-disable-next-line no-restricted-syntax
  for (const blog of initialBlogsFixtures) {
    const blogObject = new Blog(blog);
    // eslint-disable-next-line no-await-in-loop
    await blogObject.save();
  }
});

afterAll(() => {
  mongoose.connection.close();
});
