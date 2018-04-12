const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const morganLogger = require('morgan');
const createNamespace = require('continuation-local-storage').createNamespace;

const utils = require('./utils');
const logger = require('./logger');
const errorHandler = require('./errorHandler');
const index = require('./components/rootRoute');
const users = require('./components/users/usersRoute');

const myRequest = createNamespace('my request');
const app = express();

// Assign a unique identifier to each request
app.use(function(req, res, next) {
  myRequest.run(function() {
    myRequest.set('reqId', utils.generateUUID());
    next();
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Make the morgan logger work with winston
app.use(morganLogger('combined', { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  const shouldExitProcess = errorHandler.handleError(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  if (shouldExitProcess) {
    throw new Error(err);
  }
});

process.on('unhandledRejection', reason => {
  // I just caught an unhandled promise rejection, since we already have fallback handler for unhandled errors (see below), let throw and let him handle that
  throw reason;
});
process.on('uncaughtException', error => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
  const shouldExitProcess = errorHandler.handleError(error);
  if (shouldExitProcess) {
    throw new Error(error);
  }
});

module.exports = app;
