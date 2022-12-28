const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
  await User.insertMany(helper.initialUsers);
});

describe('when there is initially some blogs saved', () => {
  test('returns blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns same number of blogs as in fixtures', async () => {
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

describe('viewing a specific blog', () => {
  test('succeeds with valid id', async () => {
    const blogToView = helper.initialBlogs[0];
    // eslint-disable-next-line no-underscore-dangle
    const id = blogToView._id;

    const response = await api.get(`/api/blogs/${id}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body.id).toBe(id);
    expect(response.body.title).toBe(blogToView.title);
  });

  test('returns 404 if no blog', async () => {
    await api.get('/api/blogs/63ac025d9ca50126c96fc989')
      .expect(404);
  });
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

  test('adds user to blog', async () => {
    const response = await api.post('/api/blogs')
      .send({
        title: 'New blog',
        author: 'Test author',
        url: 'google.com',
        likes: 0,
      });

    expect(response.body.user).toBeDefined();
    expect(response.body.user.username).toBe(helper.initialUsers[0].username);
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
    const blogToDelete = helper.initialBlogs.at(-1);
    // eslint-disable-next-line no-underscore-dangle
    const id = blogToDelete._id;

    await api.delete(`/api/blogs/${id}`)
      .expect(204);

    const blogsAfterDelete = await helper.blogsInDb();
    const titles = blogsAfterDelete.map((b) => b.title);

    expect(blogsAfterDelete.length).toBe(helper.initialBlogs.length - 1);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('updating of a blog', () => {
  test('succeeds with valid data', async () => {
    const blogToUpdate = helper.initialBlogs[0];
    // eslint-disable-next-line no-underscore-dangle
    const id = blogToUpdate._id;

    const newAuthor = 'Jackie Chan';
    const updatedBlogReponse = await api.put(`/api/blogs/${id}`)
      .send({
        author: newAuthor,
      })
      .expect(200);

    expect(updatedBlogReponse.body.author).toBe(newAuthor);
    expect(updatedBlogReponse.body.title).toBe(blogToUpdate.title);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.map((b) => b.author)).toContain(newAuthor);
  });

  test('fails with no data', async () => {
    const blogToUpdate = helper.initialBlogs[0];
    // eslint-disable-next-line no-underscore-dangle
    const id = blogToUpdate._id;

    const updatedBlogResponse = await api.put(`/api/blogs/${id}`)
      .expect(400);

    expect(updatedBlogResponse.body.error).toBe('no params to update');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
