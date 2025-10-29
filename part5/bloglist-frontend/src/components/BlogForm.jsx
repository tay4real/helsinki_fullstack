import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              type='text'
              onChange={({ target }) => setTitle(target.value)}
              value={title}
              name='title'
              placeholder='Enter blog title'
            />
          </label>
        </div>
        <div>
          <label>
            author:{' '}
            <input
              type='text'
              onChange={({ target }) => setAuthor(target.value)}
              value={author}
              name='author'
              placeholder='Enter blog author'
            />
          </label>
        </div>

        <div>
          <label>
            url:
            <input
              type='text'
              onChange={({ target }) => setUrl(target.value)}
              value={url}
              name='url'
              placeholder='Enter blog URL'
            />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default BlogForm;
