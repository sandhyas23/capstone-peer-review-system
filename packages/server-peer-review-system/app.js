var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var submissionRouter = require('./routes/submissiontaskRoute');
var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/submissions', submissionRouter);
app.use('/users', usersRouter);
app.use('/',indexRouter);

module.exports = app;
