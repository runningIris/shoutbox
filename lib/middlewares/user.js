const User = require('../user');

module.exports = (req, res, next) => {
  
  if (req.remoteUser) {
    res.locals.user = req.remoteUser;
  }
  
  const { uid } = req.session;
  if (uid) {
    User.get(uid, (err, user) => {
      if (err) return next(err);
      req.user = res.locals.user = user;
      next();
    });
  } else {
    next();
  }
};