const { getDecodedTokenData } = require('./token');

const tokenExtractor = (req, res, next) => {
  const token = getDecodedTokenData(req);
  if (token === false) {
    next();
  }

  req.token = token;

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(error.message);
  }

  if (error.name === 'CastError') {
    return res.status(404).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  return next(error);
};

module.exports = {
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
};
