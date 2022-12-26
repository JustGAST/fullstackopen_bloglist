const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('when there is initially some blogs saved', () => {
  test('returns notes as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns same number of notes as in fixtures', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
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
});

describe('viewing a specific note', () => {

});

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
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

    expect(response.body.title).toBe('New blog');

    const blogsResponse = await api.get('/api/blogs');
    expect(blogsResponse.body.length).toBe(helper.initialBlogs.length + 1);
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

  test('fails with 400 if no title or url', async () => {
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

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const noteToDelete = helper.initialBlogs.at(-1);
    // eslint-disable-next-line no-underscore-dangle
    const id = noteToDelete._id;

    await api.delete(`/api/blogs/${id}`)
      .expect(204);

    const blogsAfterDelete = await helper.blogsInDb();
    const titles = blogsAfterDelete.map((b) => b.title);

    expect(blogsAfterDelete.length).toBe(helper.initialBlogs.length - 1);
    expect(titles).not.toContain(noteToDelete.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
