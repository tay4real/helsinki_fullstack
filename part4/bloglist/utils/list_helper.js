const dummy = (blogs) => {
  if (blogs) {
    return 1;
  }
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
  return blogs.length === 0 ? 0 : total;
};

const favoriteBlogs = (blogs) => {
  return blogs.reduce((mostLiked, blog) => {
    if (mostLiked.hasOwnProperty('likes')) {
      if (blog.likes > mostLiked.likes) {
        mostLiked = { ...blog };
      }
    } else {
      mostLiked = { ...blog };
    }

    return mostLiked;
  }, {});
};

const mostBlogs = (blogs) => {
  const posts = [];
  blogs.forEach((blog) => {
    if (posts.length === 0) {
      posts.push({
        author: blog.author,
        blogs: 1,
      });
    } else {
      const index = posts.findIndex((post) => post.author === blog.author);
      if (index !== -1) {
        posts[index].blogs = posts[index].blogs + 1;
      } else {
        posts.push({
          author: blog.author,
          blogs: 1,
        });
      }
    }
  });

  return posts.reduce((highestBlogs, post) => {
    if (highestBlogs.hasOwnProperty('blogs')) {
      if (post.blogs > highestBlogs.blogs) {
        highestBlogs = { ...post };
      }
    } else {
      highestBlogs = { ...post };
    }

    return highestBlogs;
  }, {});
};

const mostLikes = (blogs) => {
  const authorLikes = [];
  blogs.forEach((blog) => {
    if (authorLikes.length === 0) {
      authorLikes.push({
        author: blog.author,
        likes: blog.likes,
      });
    } else {
      const index = authorLikes.findIndex(
        (authorLike) => authorLike.author === blog.author
      );
      if (index !== -1) {
        authorLikes[index].likes = authorLikes[index].likes + blog.likes;
      } else {
        authorLikes.push({
          author: blog.author,
          likes: blog.likes,
        });
      }
    }
  });

  return authorLikes.reduce((mostLikes, authorLike) => {
    if (mostLikes.hasOwnProperty('likes')) {
      if (authorLike.likes > mostLikes.likes) {
        mostLikes = { ...authorLike };
      }
    } else {
      mostLikes = { ...authorLike };
    }

    return mostLikes;
  }, {});
};

module.exports = { dummy, totalLikes, favoriteBlogs, mostBlogs, mostLikes };
