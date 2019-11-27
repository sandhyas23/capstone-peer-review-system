const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const submissionTaskRouter = require('./routes/submissiontaskRoute');
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const submissionsRouter =  require('./routes/submissions');
const reviewTaskRouter = require('./routes/reviewtaskRoute');
const reviewsRouter = require('./routes/reviewsRoute');
const studentAssignRouter = require('./routes/studentAssignRoute');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use('/submissionTask', submissionTaskRouter);
app.use('/submissions',submissionsRouter);
app.use('/reviewTask',reviewTaskRouter);
app.use('/reviews',reviewsRouter);
app.use('/studentAssignment',studentAssignRouter);
app.use('/users', usersRouter);
app.use('/',indexRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);




module.exports = app;
