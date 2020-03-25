const express = require('express');
const User = require('../../lib/user');
const Entry = require('../../lib/entry');

exports.auth = express.basicAuth(User.authenticate);

exports.user = (req, res, next) => {
  User.get(req.params.id, (err, user) => {
    if (err) return next(err);
    if (!user.id) return res.send(404);
    res.json(user.toJSON());
  });
};

exports.entries = (req, res, next) => {
  const page = req.params.page ? req.page : { from: 0, to: -1 };
  
  Entry.getRange(page.from, page.to, (err, entries) => {
    if (err) return next(err);
    const format = {
      'application/json': () => res.send(entries),
      'application/xml': () => res.render('entries/xml', { entries })
    };
    res.format(format);
  });
};
