const { test, expect, beforeEach, describe } = require('@playwright/test');

const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click();
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click();
  await page.getByTestId('title').fill(title);
  await page.getByTestId('author').fill(author);
  await page.getByTestId('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
};

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    
    // Create a test user
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    });
    
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong');
      const errorDiv = await page.locator('.error');
      await expect(errorDiv).toContainText('wrong credentials');
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'New Blog Title', 'Author Name', 'http://newblogurl.com');
      await expect(page.getByText('New Blog Title Author Name')).toBeVisible();
    });

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First Blog', 'Author', 'http://firstblog.com');
        await createBlog(page, 'Second Blog', 'Author', 'http://secondblog.com');
        await createBlog(page, 'Third Blog', 'Author', 'http://thirdblog.com');
      });

      test('a blog can be liked', async ({ page }) => {
        await page.getByText('Second Blog Author').click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('likes 1')).toBeVisible();
      });

      test('a blog can be deleted by the user who created it', async ({ page }) => {
        await page.getByText('First Blog Author').click();
        await page.getByRole('button', { name: 'remove' }).click();
        page.on('dialog', dialog => dialog.accept());
        await expect(page.getByText('First Blog Author')).not.toBeVisible();
      });

      test('only the creator can see the delete button', async ({ page }) => {
        await page.getByText('First Blog Author').click();
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();
      });

      test('blogs are ordered according to likes', async ({ page }) => {
        await page.getByText('First Blog Author').click();
        await page.getByText('Second Blog Author').click();
        await page.getByText('Third Blog Author').click();
        
        await page.getByText('First Blog').getByRole('button', { name: 'like' }).click();
        await page.getByText('Second Blog').getByRole('button', { name: 'like' }).click();
        await page.getByText('Second Blog').getByRole('button', { name: 'like' }).click();

        const blogs = await page.getByRole('listitem').allTextContents();
        expect(blogs[0]).toContain('Second Blog');
      });
    });
  });
});
