const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const result = await blog.save();

  response.status(201).json(result);
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
