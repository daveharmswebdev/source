const bcrypt = require('bcrypt');
const User = require('./User');

const save = async body => {
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const userToCreate = {
    ...body,
    password: hashedPassword,
  };

  await User.create(userToCreate);
};

module.exports = { save };
