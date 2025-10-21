const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const api = supertest(app);

let token;

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    // Create a user to obtain a token
    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({ username: 'testuser', passwordHash });
    await user.save();

    // Log in to get the token
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'password' });

    token = loginResponse.body.token;

    // Add initial blogs
    const blogObjects = helper.initialBlogs.map(
      (blog) => new Blog({ ...blog, user: user._id })
    );
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('unique identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs');

    response.body.forEach((blog) => {
      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });

  test('HTTP POST to /api/blogs creates a new blog post', async () => {
    const newBlog = {
      title: 'A new blog',
      author: 'Ademuyiwa Otubusin',
      url: 'http://newblog.com/',
      likes: 4,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((t) => t.title);
    assert(titles.includes('A new blog'));
  });

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Ademuyiwa Otubusin',
      url: 'http://testblog.com/',
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test('fails with 400 Bad Request if title or url properties is missing when creating new blogs', async () => {
    const newBlog = {
      author: 'Ademuyiwa Otubusin',
      title: 'A new Blog',
      likes: 3,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test('fails with 401 Unauthorized if token is not provided when creating a blog', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Ademuyiwa Otubusin',
      url: 'http://unauthorized.com/',
      likes: 1,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const titles = blogsAtEnd.map((t) => t.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });
  });

  describe('updating a blog', () => {
    test('successully updates the number of likes for a blog post', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedData = { ...blogToUpdate, likes: 10 };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, 10);

      const updatedBlogInDB = await Blog.findById(blogToUpdate.id);
      assert.strictEqual(updatedBlogInDB.likes, 10);
    });
  });
});

describe('when there is initially one use in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  describe('creating a user', () => {
    test.only('creating succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'aotubusin',
        name: 'Ademuyiwa Otubusin',
        password: 'aotubusin',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test.only('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert.ok(result.body.error.includes('`username` to be unique'));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test.only('creation fails with proper statuscode and message if username is too short', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'ro',
        name: 'Superuser',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert.ok(
        result.body.error.includes('is shorter than the minimum allowed length')
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test.only('creation fails with proper statuscode and message if password is too short', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'validusername',
        name: 'Superuser',
        password: 'sa',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert.ok(
        result.body.error.includes(
          'Password must be at least 3 characters long'
        )
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
