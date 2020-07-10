var express = require('express');
var router = express.Router();
//var csrf = require('csurf');
var passport = require('passport');
var bcrypt =require('bcryptjs');

// var csrfProtection = csrf();
// router.use(csrfProtection);
//Get user model
var User =require('../models/user');
// Get register

router.get('/register',isLoggedIn,function(req,res){
  var messages = req.flash('error');
  res.render('user/register',{
    title:'Register'
  });
  
});

// Post register

router.post('/register',function(req,res){
  var name=req.body.name;
  var email=req.body.email;
  var username=req.body.username;
  var password=req.body.password;
  var password2=req.body.password2;
  req.checkBody('name','Name is required!').notEmpty();
  req.checkBody('email','Email is required!').isEmail();
  req.checkBody('username','username is required!').notEmpty();
  req.checkBody('password','Password is required!').notEmpty();
  req.checkBody('password2','Password do not match!').equals(password);

  var errors =req.validationErrors();
  if(errors){
    res.render('user/register',{
      errors:errors,
      title:'Register'
    });
  }
  else{
    User.findOne({username:username},function(err,user){
      if(err) console.log(err);
      if(user){
       req.flash('danger','Username exists,choose another!');
     // res.send(req.flash('danger'));
      res.redirect('/user/register');
      }
      else{
        var user =new User({
          name:name,
          email:email,
          username:username,
          password:password,
          vendor:0
        });
        bcrypt.genSalt(10,function(err,salt){
          bcrypt.hash(user.password,salt,function(err,hash){
            if(err) console.log(err);
            user.password=hash;
            user.save(function(err){
              if (err) console.log(err);
              else{
                req.flash('success','You are now registered!');
                res.redirect('/user/login');
              }
            });
          });
        });   
      }
    });

  }
  
  
})

//get login
router.get('/login',function(req,res){
  if (res.locals.user) res.redirect('/');

  res.render('user/login',{
    title:'Login'
  });
  
})
//Post login
router.post('/login',function(req,res,next){
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/user/login',
    failureFlash:true

  })(req,res,next);

  });
//get logout
router.get('/logout', function(req,res,next){
  req.logout();
  req.flash('sucess','you are logged out!');
  res.redirect('/');
});
module.exports = router;

// router.get('/profile',isLoggedIn,function(req, res, next){
//   res.render('user/profile');
// });

// router.get('/logout',isLoggedIn, function(req,res,next){
//   req.logout();
//   res.redirect('/');
// });

// router.use('/', notLoggedIn, function(req, res, next){
//   next();
// });


// router.get('/signup',function(req, res, next){
//   var messages = req.flash('error');
//   res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
// });

// router.post('/signup', passport.authenticate('local.signup',{
//   successRedirect:'/user/profile',
//   failureRedirect:'/user/signup',
//   failureFlash:true
// }));

// router.get('/signin',function(req, res, next){
//   var messages = req.flash('error');
//   res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
// });

// router.post('/signin', passport.authenticate('local.signin',{
//   successRedirect:'/user/profile',
//   failureRedirect:'/user/signin',
//   failureFlash:true
// }));

// module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else{
    res.redirect("/");
  }
}

// function notLoggedIn(req, res, next){
//   if(!req.isAuthenticated()){
//     //req.isAuthenticated() will return true if user is logged in
//     next();
//   } else{
//     res.redirect("/");
//   }
// }
