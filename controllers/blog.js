const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { getDecodedTokenData } = require('../utils/token');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const tokenData = getDecodedTokenData(request);
  const blogData = request.body;

  const user = await User.findById(tokenData.id);
  if (!user) {
    response.status(400).json({ error: 'no such user found' });
  }

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

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await Blog.findByIdAndDelete(id);

  response.status(204).end();
});

module.exports = blogsRouter;
