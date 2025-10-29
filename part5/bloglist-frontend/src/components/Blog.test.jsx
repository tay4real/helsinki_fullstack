import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import BlogForm from './BlogForm';
import { expect } from 'vitest';

const blog = {
  title: 'Component testing is done with react-testing-library',
  Author: 'Blog Author',
  url: 'www.test.com',
  likes: 5,
  user: {
    username: 'aotubusin',
    name: 'Otubusin Ademuyiwa',
  },
};

test('renders title and author but not url and likes by default', () => {
  const { container } = render(<Blog blog={blog} />);

  const showByDefault = container.querySelector('.blog-summary');
  const hideByDefault = container.querySelector('.blog-details');

  //   author and title are shown by default
  expect(showByDefault).toBeVisible();
  expect(showByDefault).not.toHaveTextContent('www.test.com');
  expect(showByDefault).not.toHaveTextContent('likes 5');

  //   url and likes are hidden by default
  expect(hideByDefault).not.toBeVisible();
  expect(hideByDefault).toHaveStyle('display: none');

  expect(hideByDefault).toHaveTextContent('www.test.com');
  expect(hideByDefault).toHaveTextContent('likes 5');
});

test('shows url and likes when the view button is clicked', async () => {
  const { container } = render(<Blog blog={blog} />);

  const showByDefaultContainer = container.querySelector('.blog-summary');
  const hideByDefaultContainer = container.querySelector('.blog-details');

  //   contents of showByDefaultContainer
  expect(showByDefaultContainer).toHaveTextContent(
    'Component testing is done with react-testing-library'
  );

  expect(showByDefaultContainer).not.toHaveTextContent('www.test.com');
  expect(showByDefaultContainer).not.toHaveTextContent('likes 5');

  // contents of hideByDefaultContainer
  expect(hideByDefaultContainer).toHaveTextContent('www.test.com');
  expect(hideByDefaultContainer).toHaveTextContent('likes 5');

  //   Before clicking the button
  expect(showByDefaultContainer).toBeVisible(); // visible
  expect(hideByDefaultContainer).not.toBeVisible(); // not visible
  expect(hideByDefaultContainer).toHaveStyle('display: none');

  //   clicking the view button
  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  //   After clicking the button
  expect(showByDefaultContainer).not.toBeVisible(); // not visible
  expect(showByDefaultContainer).toHaveStyle('display: none');
  expect(hideByDefaultContainer).toBeVisible(); // visible
});

test('calls the like event handler twice when the like button is clicked twice', async () => {
  const mockHandler = vi.fn();

  render(<Blog blog={blog} likeBlog={mockHandler} />);
  const user = userEvent.setup();

  // Click the view button to reveal the like button
  const viewButton = screen.getByText('view');
  await user.click(viewButton);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);

  // Verify that the event handler was called twice
  expect(mockHandler).toHaveBeenCalledTimes(2);
});

test('calls the event handler with correct details when a new blog is created', async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  // Fill in the input fields
  const titleInput = screen.getByPlaceholderText('Enter blog title');
  const authorInput = screen.getByPlaceholderText('Enter blog author');
  const urlInput = screen.getByPlaceholderText('Enter blog URL');
  const createButton = screen.getByText('create');

  await user.type(titleInput, 'Machine Learning in Mental Health');
  await user.type(authorInput, 'Ademuyiwa Otubusin');
  await user.type(urlInput, 'https://otubusinademuyiwa.com/ml-mental-health');
  await user.click(createButton);

  // Check that the event handler was called once
  expect(createBlog).toHaveBeenCalledTimes(1);

  // Verify the handler was called with correct details
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Machine Learning in Mental Health',
    author: 'Ademuyiwa Otubusin',
    url: 'https://otubusinademuyiwa.com/ml-mental-health',
  });
});
