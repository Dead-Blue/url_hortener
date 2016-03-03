var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var routes = require('./routes/index');
var news = require('./routes/news');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/url_hortener');

require('./model/url.js');
var UrlModel = mongoose.model('Url')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/new', news);
app.use('/', function(req, res, next) {
  var url = req.url;
  url='http://'+req.headers.host+'/'+url.slice(1);
  UrlModel.findOne({short_url:url}).exec(function (err,urls) {
      if(err){
         return res.send({error:'MongoDB Error'})
      } else if(urls!=null) {
          res.redirect(urls.original_url);
      } else 
         res.send({error:'No short url found for given input'});
  })
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
