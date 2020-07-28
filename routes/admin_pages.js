var express = require('express');
var router = express.Router();
var auth=require('../config/auth');
var isAdmin =auth.isAdmin;

var User = require('../models/user');
var Product = require('../models/product');
const user = require('../models/user');


router.get('/',isAdmin,function(req,res){
    var messages = req.flash('error');
    User.count(function(err,c){
        count=c;
    });
    User.find(function(err,users){
        res.render('admin/admin',{
            users:users,
            count:count,
            messages:messages,
            name : res.locals.user.name
         });
    });
    
});
//delete admin
router.get('/deletead/:id', function(req, res, next){
    User.findById(req.params.id,function(err,user){
        if (err) console.log('err');
        else{
        user.admin = 0;
        user.user = 1;
        user.save(function(err){
            if(err) console.log(err);
            req.flash('error','deleted admin');
            res.redirect('/admin');
        });
        }
    });
  });
//delete vendor
router.get('/deletevendor/:id', function(req, res, next){
    User.findById(req.params.id,function(err,user){
        if (err) console.log('err');
        else{
        user.vendor = 0;
        user.user = 1;
        user.save(function(err){
            if(err) console.log(err);
            req.flash('error','deleted vendor');
            res.redirect('/admin');
        });
        
        }
        console.log(user.vendor);
    });
   
  });
//add admin 
  router.get('/addad/:id', function(req, res, next){
    User.findById(req.params.id,function(err,user){
        if (err) console.log('err');
        else{
        user.admin = 1;
        user.user = 0;
        user.save(function(err){
            if(err) console.log(err);
            req.flash('error','added admin');
            res.redirect('/admin');
        });
        }
    });
  });

  //add vendor 
  router.get('/addvendor/:id', function(req, res, next){
    User.findById(req.params.id,function(err,user){
        if (err) console.log('err');
        else{
        user.vendor = 1;
        user.user = 0;
        user.save(function(err){
            if(err) console.log(err);
            req.flash('error','added vendor');
            res.redirect('/admin');
        });
        }
    });
  });

module.exports = router;