module.exports = (err, req, res, next) => {
  console.error(err);
  const msg = (() => {
    if (err.type === 'database') {
      res.statusCode = 503;
      return 'Server Unavailable';
    }
    res.statusCode = 500;
    return 'Internal Server Error';
  })();
  
  res.format({
    html: () => res.render('5xx', { msg, status: res.statusCode }),
    json: () => res.send({ error: msg }),
    text: () => res.send(msg + '\n')
  });
};