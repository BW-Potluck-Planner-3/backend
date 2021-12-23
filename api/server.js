const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// Routers
const authRouter = require('./auth/auth-router');
const userRouter = require('./users/users-router');
const potluckRouter = require('./potlucks/potlucks-router');
// const restricted = require('./middleware/restricted');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());

// Routes
server.use('/api/potlucks', potluckRouter);
server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

//eslint-disable-next-line
server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
