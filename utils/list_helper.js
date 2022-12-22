const _ = require('lodash');

const dummy = () => 1;

const totalLikes = (blogs) => {
  if (!blogs) {
    return 0;
  }

  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs) {
    return {};
  }

  if (!blogs.length) {
    return {};
  }

  const favoriteBlogItem = blogs.reduce((favorite, blog) => (
    favorite.likes > blog.likes ? favorite : blog
  ), blogs[0]);

  return {
    title: favoriteBlogItem.title,
    author: favoriteBlogItem.author,
    likes: favoriteBlogItem.likes,
  };
};

const mostBlogs = (blogs) => {
  if (!blogs) {
    return {};
  }

  const blogsByAuthor = _.countBy(blogs, (blog) => blog.author);
  const maxBlogs = _.max(Object.values(blogsByAuthor));
  const author = _.findKey(blogsByAuthor, (blogsCount) => blogsCount === maxBlogs);

  return {
    author,
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  if (!blogs) {
    return {};
  }

  const blogsByAuthor = _.groupBy(blogs, 'author');
  const likesByAuthor = _.mapValues(
    blogsByAuthor,
    (blogsByAuthorCurrent) => _.sumBy(blogsByAuthorCurrent, 'likes'),
  );
  const maxLikes = _.max(Object.values(likesByAuthor));
  const author = _.findKey(likesByAuthor, (likesCount) => likesCount === maxLikes);

  return {
    author,
    likes: maxLikes,
  };
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
