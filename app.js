var createError = require('http-errors');
const fs = require('fs');
const path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./db/redis');

const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express();

// app.use(logger('dev', {
//   stream: process.stdout
// }));
const ENV = process.env.NODE_ENV;
if(ENV !== 'production') {
  app.use(logger('dev'));
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  app.use(logger('combined', {
    stream: writeStream
  }));
}

//解析postdata json格式
app.use(express.json());
//解析postdata urlencoded格式数据
app.use(express.urlencoded({ extended: false }));
//解析cookie
app.use(cookieParser());

const sessionStore = new RedisStore({
  client: redisClient
});
app.use(session({
  secret: 'WJiol#23123_',
  cookie: {
    path: '/', //默认
    httpOnly: true, //默认
    maxAge: 24 * 60 * 60 * 1000//多久后失效 
  },
  store: sessionStore
}))

app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
