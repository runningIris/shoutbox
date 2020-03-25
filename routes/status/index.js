exports.notFound = (req, res, next) => {
  res.status(404).format({
    html: () => res.render('404'),
    json: () => res.send({ message: 'Resource not found.' }),
    xml: () => res.end(`<error><message>Resources not found.</message></error>`),
    text: () => res.send('Resource not found')
  });
};

