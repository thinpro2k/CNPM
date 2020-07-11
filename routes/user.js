var express = require('express');
var router = express.Router();
var csrf = require('csurf');
const passport = require('passport');
var User = require('../models/user');
var auth=require('../config/auth');
var isUser =auth.isUser;



var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile',isUser,function(req, res, next){
    res.render('user/profile',{
      name : res.locals.user.name,
      email : res.locals.user.email,
      username : res.locals.user.username,
    })

});

router.get('/logout',isUser, function(req,res,next){
  req.logout();
  res.redirect('/');
});

router.use('/',  function(req, res, next){
  next();
});


router.get('/register',function(req, res, next){
  var messages = req.flash('error');
  res.render('user/register',{csrfToken: req.csrfToken(), messages: messages});
});

router.post('/register', passport.authenticate('local.register',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/register',
  failureFlash:true
}));

router.get('/login',function(req, res, next){
  var messages = req.flash('error');
  res.render('user/login',{csrfToken: req.csrfToken(), messages: messages});
});

router.post('/login', passport.authenticate('local.login',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/login',
  failureFlash:true
}));

module.exports = router;