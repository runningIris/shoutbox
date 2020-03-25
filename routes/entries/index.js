const Entry = require('../../lib/entry');

exports.list = (req, res, next) => {
  const { page } = req;
  Entry.getRange(page.from, page.to, (err, entries) => {
    if (err) return next(err);
    res.render('entries', {
      title: 'Entries',
      entries
    });
  });
};

exports.form = (req, res, next) => {
  res.render('post', {
    title: 'Post'
  });
};

exports.submit = (req, res, next) => {
  const { entry: { title, body } } = req.body;
  
  const { user } = res.locals;
  
  if (!user) {
    res.error('You are not login.');
    return res.redirect('back');
  }
  
  const entry = new Entry({
    username: user.name,
    title,
    body
  });
  
  entry.save(err => {
    if (err) return next(err);
    if (req.remoteUser) {
      res.join({
        message: 'Entry added.'
      });
    } else {
      res.redirect('/');
    }
  });
};

exports.examEntryTitle = (req, res, next) => {
  const { title } = req.body.entry;
  
  if (!title) {
    res.error('Post title is required.');
    return res.redirect('back');
  }
  
  if (title.length < 4) {
    res.error('Title must be longer than 4 characters.');
    return res.redirect('back');
  }
  
  next();
};

exports.examEntryBody = (req, res, next) => {
  const { body } = req.body.entry;
  
  if (!body) {
    res.error('Post body is required.');
    return res.redirect('back');
  }
  
  next();
};
