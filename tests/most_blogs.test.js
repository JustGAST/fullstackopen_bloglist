const blogs = require('./blogs_fixtures');
const { mostBlogs } = require('../utils/list_helper');

describe('most blogs', () => {
  test('of zero blogs', () => {
    expect(mostBlogs([])).toEqual({});
  });

  test('of one blog', () => {
    expect(mostBlogs([blogs[0]])).toEqual({
      author: blogs[0].author,
      blogs: 1,
    });
  });

  test('of more blogs', () => {
    expect(mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});
