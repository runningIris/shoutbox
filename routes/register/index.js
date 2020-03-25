const User = require('../../lib/user');

exports.form = (req, res) => {
  res.render('register', { title: 'Register' } );
};

exports.submit = (req, res, next) => {
  console.log(req.body);
  User.getByName(req.body.user.name, (err, user) => {
    if (err) return next(err);
    
    if (user.id) {
      res.error('Username already taken!');
      res.redirect('back');
    } else {
      const { name, password: pass } = req.body.user;
      user = new User({
        name,
        pass
      });
      
      user.save(err => {
        if (err) return next(err);
        req.session.uid = user.id;
        res.redirect('/');
      });
    }
  });
};