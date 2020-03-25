const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const messages = require('./lib/messages');
const injectUser = require('./lib/middlewares/user');
const Entry = require('./lib/entry');
const page = require('./lib/middlewares/page');
const routes = require('./routes');

const app = express();

const noop = () => {};

app.configure(() => {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('title', 'Shout Box');
  app.use(express.static(path.join(__dirname, 'public')), noop);
  app.use(express.logger('dev'), noop);
  app.use(bodyParser.json(), noop);
  app.use(bodyParser.urlencoded({ extended: true }), noop);
  app.use(express.methodOverride(), noop);
  app.use(express.cookieParser('Your secret here'), noop);
  app.use(express.session(), noop);
  app.use(messages, noop);
  app.use(injectUser, noop);
  app.use('/api', routes.api.auth);
  app.use(app.router, noop);
  app.use(routes.status.notFound, noop);
  app.use(routes.error, noop);
});

app.configure('development', () => {});
app.configure('production', () => {});

const port = app.get('port');

app.get('/register', routes.register.form);
app.post('/register', routes.register.submit);

app.get('/login', routes.login.form);
app.post('/login', routes.login.submit);
app.get('/logout', routes.login.logout);

app.get('/post', routes.entries.form);
app.post('/post', routes.entries.examEntryTitle, routes.entries.examEntryBody, routes.entries.submit);
app.get('/', page(Entry.count, 5), routes.entries.list);

app.get('/api/user/:id', routes.api.user);
app.get('/api/entries/:page?', page(Entry.count, 3), routes.api.entries);
app.post('/api/entry', routes.entries.submit);

if (process.env.ERROR_ROUTE) {
  app.get('/dev/error', (req, res, next) => {
    const err = new Error('Database connection failed.');
    err.type = 'database';
    next(err);
  });
}

http.createServer(app).listen(port, () => {
  console.log(`Express server is listening on port ${port}...`);
});
