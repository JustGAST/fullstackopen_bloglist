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
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const initialBlogs = initialBlogsFixtures.map((blog) => new Blog(blog));
  const savePromises = initialBlogs.map((blog) => blog.save());
  await Promise.all(savePromises);
});

afterAll(() => {
  mongoose.connection.close();
});
