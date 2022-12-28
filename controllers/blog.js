const blogsRouter = require('express').Router();
const { tokenExtractor, userExtractor } = require('../utils/middleware');
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  const { user } = request;
  if (!user) {
    response.status(401).json({ error: 'no such user found' });
  }

  const blogData = request.body;
  blogData.user = user._id;

  const blog = new Blog(blogData);
  await blog.save();

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  await blog.populate('user', { username: 1, name: 1 });

  response.status(201).json(blog);
});

blogsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    response.status(404).end();
    return;
  }

  response.json(blog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const {
    title, author, url, likes,
  } = request.body;

  if (!(author || title || url || likes)) {
    response.status(400).json({ error: 'no params to update' });

    return;
  }

  const data = {
    title, author, url, likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query' });

  response.json(updatedBlog);
});

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const { user } = request;
  if (!user) {
    response.status(401).json({ error: 'auth token should be sent and valid' });
    return;
  }

  const { id } = request.params;
  const userId = user._id.toString();
  const blog = await Blog.findById(id);

  if (blog.user.toString() !== userId) {
    response.status(403).json({ error: 'you don\'t have permissions to delete this blog' });
    return;
  }

  await Blog.deleteOne({ _id: blog._id });
  response.status(204).end();
});

module.exports = blogsRouter;
