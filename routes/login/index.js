const User = require('../../lib/user');

exports.form = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.submit = (req, res, next) => {
  const { name, password } = req.body.user;
  User.authenticate(name, password, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.session.uid = user.id;
      res.redirect('/');
    } else {
      res.error('Sorry! Invalid credentials.');
      res.redirect('back');
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(function(err) {
    if (err) throw err;
    res.redirect('/');
  });
};