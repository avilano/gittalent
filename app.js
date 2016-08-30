// global io

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const favicon = require('serve-favicon');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const debug = require('debug')('app');

const routes = require('./routes/index');
const User = require('./models/User');

require('dotenv').config();

const DB_NAME = process.env.DB_NAME;
const MONGO_PASS = process.env.MONGO_DB_PASS;
const MONGO_HOST = process.env.OPENSHIFT_MONGODB_DB_HOST;
const MONGO_PORT = process.env.OPENSHIFT_MONGODB_DB_PORT;

if (MONGO_HOST) {
  mongoose.connect(`mongodb://admin:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}`);
} else {
  mongoose.connect(`mongodb://localhost/${DB_NAME}`);
}

const app = express();
const io = global.io = app.io = socketio();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Client ID for GitHub as local for Jade
app.locals.gitClientId = process.env.CLIENT_ID;

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, './public')));

app.use('/', routes);
// app.use('/courses', courses);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {},
  });
});

module.exports = app;
