const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  if (!user || !password) {
    response.status(400).json({ error: 'incorrect username or password' });
    return;
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    response.status(400).json({ error: 'incorrect password' });
    return;
  }

  const tokenData = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(tokenData, process.env.SECRET);

  response
    .status(200)
    .json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
