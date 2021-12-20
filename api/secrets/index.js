module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'shh',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 6,
};
