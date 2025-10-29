import React, { useState } from 'react';

const Blog = ({ blog, likeBlog, deleteBlog, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = (id) => {
    likeBlog(id);
  };

  const handleDelete = (id, title, author) => {
    confirm(`Remove blog ${title} by ${author}`) && deleteBlog(id);
  };

  console.log(blog);
  console.log(username);
  return (
    <div style={blogStyle}>
      <div className='blog-summary' style={hideWhenVisible}>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div className='blog-details' style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}{' '}
          <button onClick={toggleVisibility}>hide</button>
        </div>

        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button onClick={() => handleLike(blog.id)}>like</button>
        </div>

        <div>{blog.user && blog.user.name}</div>

        {blog.user && blog.user.username === username && (
          <button
            onClick={() => handleDelete(blog.id, blog.title, blog.author)}>
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
