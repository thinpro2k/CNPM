var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var csrf = require('csurf');
const passport = require('passport');
const { route } = require('./user');
var Handlebars = require('handlebars');
var auth=require('../config/auth');
const flash = require('express-flash');
var User= require('../models/user');
var auth=require('../config/auth');
var isUser =auth.isUser;
/* GET home page. */
router.get('/',function(req, res, next) {
  var messages = req.flash('error');
  
 
  
  Product.find(function(err, docs){
      console.log(docs);
     var productChunks = [];
    var chunkSize = docs.length;
    for( var i= 0 ; i < docs.length ; i+= chunkSize) {
        productChunks.push(docs.splice(i, i + chunkSize));
    }
    if (req.isAuthenticated()) {
      res.render('shop/index', { title: 'Shopping Cart' , products : productChunks,messages: messages,name:res.locals.user.name});
    }
    else {
     res.render('shop/index', { title: 'Shopping Cart' , products : productChunks,messages: messages});
    }
    
  }).lean();
  
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});

  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});
router.get('/add/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});

  cart.increaseOne(productId);
  req.session.cart =cart;
  res.redirect('/shopping-cart');
});
router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});

  cart.reduceByOne(productId);
  req.session.cart =cart;
  res.redirect('/shopping-cart');
});
router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});

  cart.removeItem(productId);
  req.session.cart =cart;
  res.redirect('/shopping-cart');
});
router.get('/shopping-cart',function(req,res,next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout',function(req,res,next){
  
  res.render('shop/checkout');
});

Handlebars.registerHelper("counter", function (index){
  return index + 1;
});
module.exports = router;
