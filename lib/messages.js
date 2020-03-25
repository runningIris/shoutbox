const express = require('express');
const res = express.response;

res.message = function(msg, type = 'info') {
  const { session = [] } = this.req;
  session.messages.push({ type: type, string: msg });
};

res.error = function(msg) {
  return this.message(msg, 'error');
};

module.exports = (req, res, next) => {
  const { messages = [] } = req.session;
  res.locals.messages = messages;
  res.locals.removeMessages = function(){
    req.session.messages = [];
  };
  next();
};
