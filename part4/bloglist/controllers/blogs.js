const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;

  // const decodedToken = jwt.verify(request.token, process.env.SECRET);

  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' });
  // }

  // const user = await User.findById(decodedToken.id);
  const user = request.user;

  if (!body.title || !body.url) {
    response.status(400).json({ error: 'title and url are required' });
  }

  if (!user) {
    response.status(400).json({ error: 'UserId missing or not valid' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  blog.populate('user', { username: 1, name: 1 });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);

  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' });
  // }

  // const user = await User.findById(decodedToken.id);
  const user = request.user;

  if (!user) {
    response.status(400).json({ error: 'UserId missing or not valid' });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: 'unauthorized action' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  if (!blog) {
    response.status(404).end();
  }

  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;

  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

module.exports = blogsRouter;
