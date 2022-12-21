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

module.exports = {
  dummy, totalLikes, favoriteBlog,
};
