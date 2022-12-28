const getDecodedTokenData = (request) => {
  const authHeader = request.get('authorization');
  if (!authHeader) {
    return false;
  }

  if (authHeader.indexOf('bearer') === false) {
    return false;
  }

  return authHeader.split(' ')[1];
};

module.exports = {
  getDecodedTokenData,
};
