const { favoriteBlog } = require('../utils/list_helper');
const blogs = require('./blogs_fixtures');

describe('favorite blog', () => {
  test('of empty list is empty object', () => {
    const favorite = favoriteBlog([]);

    expect(favorite).toBeInstanceOf(Object);
    expect(favorite).toEqual({});
  });

  test('when list has only one blog equals the likes of that', () => {
    const blog = blogs[0];
    const blogsWithOne = [blog];

    const expected = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    };

    expect(favoriteBlog(blogsWithOne)).toEqual(expected);
  });

  test('of bigger list is that with largest likes count', () => {
    const expected = {
      title: 'lexi-lambda',
      author: 'Alexis King',
      likes: 12,
    };

    const favorite = favoriteBlog(blogs);

    expect(favorite).toEqual(expected);
  });
});
