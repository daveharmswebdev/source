const express = require('express');
const { save } = require('./UserService');
const router = express.Router();

router.post('/api/v1/users', async (req, res) => {
  const user = req.body;

  if (user.username === null) {
    return res.status(400).send({
      validationErrors: {
        username: 'Username cannot be null',
      },
    });
  }

  await save(req.body);

  return res.send({ message: 'User Created' });
});

module.exports = router;
