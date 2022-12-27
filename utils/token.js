const jwt = require('jsonwebtoken');

const getDecodedTokenData = (request) => {
  const authHeader = request.get('authorization');
  if (!authHeader) {
    return false;
  }

  if (authHeader.indexOf('bearer') === false) {
    return false;
  }

  const token = authHeader.substring(7);

  return jwt.verify(token, process.env.SECRET);
};

module.exports = {
  getDecodedTokenData,
};
