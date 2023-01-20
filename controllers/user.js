const bcrypt = require('bcrypt');

const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  });

  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!(username && name && password)) {
    response.status(400).json({ error: 'missing data' });
    return;
  }

  if (password.length <= 3) {
    response
      .status(400)
      .json({ error: 'password should be longer than 3 symbols' });
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });
  await user.save();

  response.status(201).json(user);
});

module.exports = usersRouter;
