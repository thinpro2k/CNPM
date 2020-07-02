var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var session = require('express-session')
var expressHsb = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator')
var MongoStore = require('connect-mongo')(session);
var fileUpload =require('express-fileupload');
var bodyParser = require('body-parser')

var stripe =require('stripe')('sk_test_51GzJlmKPv17GXAC07gelBoXQEkIBm9iENHxSHHRc2rAHRsc9rGjm2ku4VF8vR2dSN7Kk3a3q53Zy6oLbGfeKFMgU00h0GPIChL')
var app = express();

var routes = require('./routes/index');
var userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/shop', {useNewUrlParser: true, useUnifiedTopology: true});
var db= mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
  console.log('conneted mongodb');
});
require('./config/passport')
// view engine setup
app.engine('.hbs', expressHsb({defaultLayout: 'layout', extname:'.hbs'}));
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//exprss validator
app.use(validator({
  errorFormatter: function(param,msg,value){
    var namespace =param.split('.'),
    root =namespace.shift(),
    formParam =root;
    while (namespace.length){
      formParam +='['+namespace.shift()+']';
    }
    return {
      param :formParam,
      msg:msg,
      value:value
    };

  },
  customValidators:{
    isImage:function(value,filename){
      var extension = (path.extname(filename)).toLowerCase();
      switch(extension){
        case  '.jpg':
          return '.jpg';
        case  '.jpeg':
          return '.jpeg';
        case  '.png':
          return '.png';
        case  '':
          return '.jpg';
        default :
         return false;
      }
    }
  }

  
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  {secret:'mysupersecret',
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie:{maxAge: 180 * 60 *1000}
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//express fileupload middleare
app.use(fileUpload());

//set global errors variable

app.locals.errors =null;


var vendor =require('./routes/vendor');
var adminPages =require('./routes/admin_pages');
app.use('/vendor',vendor);
app.use('/user', userRoutes);
app.use('/admin/index',adminPages);
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;