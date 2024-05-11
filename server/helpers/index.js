const crypto = require('crypto');
const bcryptjs = require('bcryptjs');

const randomId = () => crypto.randomBytes(8).toString('hex');
const hashPassword = async (password) => await bcryptjs.hash(password, 10);

module.exports = {
  randomId,
  hashPassword,
};
