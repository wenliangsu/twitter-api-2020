const passport = require('../config/passport');
const helpers = require('../_helpers');
const { User } = require('../models');

// General User'account authentication
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user)
      return res
        .status(401)
        .json({ status: 'error', message: 'Unauthorized !!' });

    req.user = user;
    return next();
  })(req, res, next);
};

// Admin account authentication
const authenticatedAdmin = (req, res, next) => {
  return helpers.getUser(req).role !== 'admin'
    ? res
        .status(401)
        .json({ status: 'error', message: `You don't have permission right` })
    : next();
};

// Prevent admin from accessing the front-end system
const authenticatedUser = (req, res, next) => {
  return helpers.getUser(req).role !== 'admin'
    ? next()
    : res.status(401).json({
        status: 'error',
        message: `Admin didn't have permission to Front-end system`,
      });
};

const socketAuth = async (req, res, next) => {
  try {
    // client send token to server like below
    // const socket = io({
    //   auth: {
    //     token: "abcd"
    //   }
    // });
    if (!socket.handshake.auth || !socket.handshake.auth.token)
      throw new Error("User's handshake.auth is required");

    const { token } = socket.handshake.auth;
    await jwt.verify(token, process.env.JWTSECRET, async (err, decoded) => {
      if (err) throw new Error('jwt auth error!');
      socket.user = await User.findByPk(decoded.id, {
        raw: true,
        attributes: [
          'id',
          'name',
          'avatar',
          [sequelize.fn('concat', '@', sequelize.col('account')), 'account'],
        ],
      });
      console.log(socket.user);
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
  socketAuth,
};
