var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
   User.findById(id, function(err, user){
       done(err, user);
   });
});

passport.use('local.register', new LocalStrategy({
    
    usernameField: 'username',
    passwordField: 'password',
    
    passReqToCallback: true
},function(req, username, password, done){
    var name = req.body.name;
    var email =req.body.email;
    var password2 =req.body.password2;
    req.checkBody('username','username is require').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    req.checkBody('name','name is require').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password2', 'password do not match').notEmpty().equals(password);
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({username:username}, function(err,user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message:'username is already in use.'});
        }
        var user = new User();
        user.name = name;
        user.email = email;
        user.username = username;
        user.password = user.encryptPassword(password);
        user.vendor = 0;
       
        user.save(function(err,result){
            if(err){
                return done(null);
            }
            return done(null, user);
        });
    });
}));
passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},function(req, username, password, done){
    req.checkBody('username','username is require').notEmpty();
    req.checkBody('password', 'password is require').notEmpty();
    
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({username:username}, function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message:'No user found.'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message:'Wrong password.'});
        }
        return done(null,user);
    });
}));