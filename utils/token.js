const getDecodedTokenData = (request) => {
  const authHeader = request.get('authorization');
  if (!authHeader) {
    return false;
  }

  if (authHeader.indexOf('bearer') === false) {
    return false;
  }

  return authHeader.substring(7);
};

module.exports = {
  getDecodedTokenData,
};
