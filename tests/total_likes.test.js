const { totalLikes } = require('../utils/list_helper');
const blogs = require('./blogs_fixtures');

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0);
  });

  test('of function without argument is zero', () => {
    expect(totalLikes()).toBe(0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const blogsWithOne = [blogs[0]];

    expect(totalLikes(blogsWithOne)).toBe(blogs[0].likes);
  });

  test('of a bigger list is calculated right', () => {
    expect(totalLikes(blogs)).toBe(48);
  });
});
