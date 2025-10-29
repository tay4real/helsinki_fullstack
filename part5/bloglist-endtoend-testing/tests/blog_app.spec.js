const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        username: 'aotubusin',
        name: 'Ademuyiwa Otubusin',
        password: 'testpassword',
      },
    });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible();
    await expect(page.getByLabel('password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'aotubusin', 'testpassword');

      await expect(
        page.getByText('Ademuyiwa Otubusin logged in')
      ).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'aotubusin', 'wrongpassword');

      await expect(page.getByText('wrong username or password')).toBeVisible();
      await expect(
        page.getByText('Ademuyiwa Otubusin logged in')
      ).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'aotubusin', 'testpassword');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'E2E testing with Playwright',
        'Ademuyiwa Otubusin',
        'https://fullstackopen.com/en/part5/end_to_end_testing_with_playwright'
      );

      await expect(
        page.getByText('E2E testing with Playwright Ademuyiwa Otubusin view')
      ).toBeVisible();
    });

    test('blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'A new blog',
        'Ademuyiwa Otubusin',
        'http://newblog.com/a-new-blog'
      );

      await expect(
        page.getByText('A new blog Ademuyiwa Otubusin view')
      ).toBeVisible();

      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByText('likes 1')).toBeVisible();
    });
  });

  describe('Blog Deletion', () => {
    beforeEach(async ({ page, request }) => {
      // create another user
      await request.post('/api/users', {
        data: {
          username: 'newuser',
          name: 'New User',
          password: 'password123',
        },
      });

      // login as the new user
      await loginWith(page, 'newuser', 'password123');

      // create a new blog by the user
      await createBlog(
        page,
        'Creating a New Blog',
        'New User',
        'http://blog.com/newblog'
      );
    });

    test('the user who created a blog can delete it', async ({ page }) => {
      //   verify that the blog is visible
      await expect(
        page.getByText('Creating a New Blog New User view')
      ).toBeVisible();

      // intercept the window.confirm dialog
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Remove blog');
        await dialog.accept();
      });

      //   expand blog details
      await page.getByRole('button', { name: 'view' }).click();

      //   ensure delete button is visible
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();

      //   click delete button
      await page.getByRole('button', { name: 'remove' }).click();

      //   verify that the blog is no longer visible
      await expect(
        page.getByText('Creating a New Blog New User view')
      ).not.toBeVisible();
    });

    test('other users cannot see the delete button', async ({ page }) => {
      // logout current user
      await page.getByRole('button', { name: 'logout' }).click();

      // login another user
      await page.getByLabel('username').fill('aotubusin');
      await page.getByLabel('password').fill('testpassword');
      await page.getByRole('button', { name: 'login' }).click();

      //   verify that the blog is visible
      await expect(
        page.getByText('Creating a New Blog New User view')
      ).toBeVisible();

      //   expand blog details
      await page.getByRole('button', { name: 'view' }).click();

      //   Ensure delete button is not visible
      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible();
    });
  });

  describe('Blog ordering by likes', () => {
    test.beforeEach(async ({ page, request }) => {
      // login
      await loginWith(page, 'aotubusin', 'testpassword');

      //   create multiple blogs
      await createBlog(
        page,
        'First Blog',
        'First Author',
        'http://firstblog.com'
      );

      await createBlog(
        page,
        'Second Blog',
        'Second Author',
        'http://secondblog.com'
      );

      await createBlog(
        page,
        'Third Blog',
        'Third Author',
        'http://thirdblog.com'
      );

      //   like the first blog 5 times
      const firstBlogText = page.getByText('First Blog');
      const firstBlogElement = firstBlogText.locator('..');
      await firstBlogElement.getByRole('button', { name: 'view' }).click();
      await firstBlogElement.getByRole('button', { name: 'like' }).click();
      await firstBlogElement.getByText('likes 1').waitFor();
      await firstBlogElement.getByRole('button', { name: 'like' }).click();
      await firstBlogElement.getByText('likes 2').waitFor();
      await firstBlogElement.getByRole('button', { name: 'like' }).click();
      await firstBlogElement.getByText('likes 3').waitFor();

      //   like second blog 10 times
      const secondBlogText = page.getByText('Second Blog');
      const secondBlogElement = secondBlogText.locator('..');
      await secondBlogElement.getByRole('button', { name: 'view' }).click();
      await secondBlogElement.getByRole('button', { name: 'like' }).click();
      await secondBlogElement.getByText('likes 1').waitFor();
      await secondBlogElement.getByRole('button', { name: 'like' }).click();
      await secondBlogElement.getByText('likes 2').waitFor();
      await secondBlogElement.getByRole('button', { name: 'like' }).click();
      await secondBlogElement.getByText('likes 3').waitFor();
      await secondBlogElement.getByRole('button', { name: 'like' }).click();
      await secondBlogElement.getByText('likes 4').waitFor();
      await secondBlogElement.getByRole('button', { name: 'like' }).click();
      await secondBlogElement.getByText('likes 5').waitFor();

      //   like third blog 2 times
      const thirdBlogText = page.getByText('Third Blog');
      const thirdBlogElement = thirdBlogText.locator('..');
      await thirdBlogElement.getByRole('button', { name: 'view' }).click();
      await thirdBlogElement.getByRole('button', { name: 'like' }).click();
      await thirdBlogElement.getByText('likes 1').waitFor();
      await thirdBlogElement.getByRole('button', { name: 'like' }).click();
      await thirdBlogElement.getByText('likes 2').waitFor();

      // Refresh the page to re-render order
      await page.reload();
    });

    test('blogs are arranged in order of likes (most liked first)', async ({
      page,
    }) => {
      // expand all blogs
      const viewButtons = await page
        .getByRole('button', { name: 'view' })
        .all();

      for (const btn of viewButtons) {
        await btn.click();
      }

      // get all blog elements
      const blogElements = await page.locator('.blog-details').all();

      //   extract likes from each blog
      const likesArray = [];
      for (const blog of blogElements) {
        const likesText = await blog.locator('text = likes').innerText();
        const likes = parseInt(likesText.replace('likes ', ''), 10);
        likesArray.push(likes);
      }

      //   Check if array is sorted descending
      const sorted = [...likesArray].sort((a, b) => b - a);

      expect(likesArray).toEqual(sorted);
    });
  });
});
