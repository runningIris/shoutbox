module.exports = (fn, perPage = 10) => (req, res, next) =>{
  const page = Math.max(parseInt(req.param('page') || '1', 10)) - 1;
  fn((err, total) => {
    if (err) return next(err);
    
    req.page = res.locals.page = {
      number: page,
      perpage: perPage,
      from: page * perPage,
      to: (page + 1) * perPage -1,
      total,
      count: Math.ceil(total / perPage)
    };
    
    next();
  });
};