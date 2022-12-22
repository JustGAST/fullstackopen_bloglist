const blogs = require('./blogs_fixtures');
const { mostLikes } = require('../utils/list_helper');

describe('most likes', () => {
  test('of zero list', () => {
    expect(mostLikes([])).toEqual({});
  });

  test('when list has only one blog equals the likes of that', () => {
    const blogsWithOne = [blogs[0]];

    expect(mostLikes(blogsWithOne)).toEqual({
      author: blogs[0].author,
      likes: blogs[0].likes,
    });
  });

  test('of blogs list', () => {
    expect(mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
