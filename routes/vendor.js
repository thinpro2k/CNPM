var express = require('express');
var router = express.Router();
var mkdirp =require('mkdirp');
var fs =require('fs-extra');
var resizeImg =require('resize-img');

var Product= require('../models/product');
var auth=require('../config/auth');
const flash = require('express-flash');
var isVendor =auth.isVendor;

//get product  index
router.get('/',isVendor,function(req,res){
   var messages = req.flash('error');
   var count ;
   Product.count(function(err,c){
       count=c;
   });
   Product.find(function(err,products){
       res.render('vendor/products',{
           products: products,
           count:count,
           messages:messages,
           name : res.locals.user.name
        });
   });
   
   
});

//get add product index
router.get('/add_product',isVendor,function(req,res){
   var title ="";
   var description ="";
   var price =""; 
   var messages = req.flash('error');
   res.render('vendor/add_product',{
       title :title,
       description : description,
       price : price,
       messages:messages,
       name : res.locals.user.name
   });
    
    

});
//post add product
router.post('/add_product',function(req,res){
    //var imageFile =typeof req.files.image !=="undefined" ? req.files.image.name :"";
   
    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('description','Content must have a value').notEmpty();
    req.checkBody('price','Price must have a value').isDecimal();
   // req.checkBody('image','you must upload image').isImage(imageFile);

    var title =req.body.title;
    var slug= title.replace(/\s+/g,'-').toLowerCase();
    var description =req.body.description;
    var price =req.body.price;
    var category =req.body.category;
    var image =req.body.image;
    
    var errors =req.validationErrors();
     if(errors){
         console.log('error');
        res.render('vendor/add_product',{
            errors:errors,
            title :title,
            description:description,
            price:price,
            category:category,
            image:image
        });

     }
     else{
         Product.findOne({slug:slug},function(err,product){
             if(product){
                req.flash('error','product is already in use');
                 res.render('vendor/add_product',{
                    title :title,
                    description:description,
                    price:price,
                    category:category,
                    image:image
                });
               
             }
             else{
                var product =new Product({
                    title :title,
                    description:description,
                    price:price,
                    slug:slug,
                    category:category,
                    image:image
                });
                product.save(function(err){
                    if(err) return console.log(err);
                    req.flash('error','product added');
                    res.redirect('/vendor');
                })
            }
         })
     }
     
});
//get   modify product
router.get('/modify-product/:id',isVendor,function(req,res){
      var errors;
      if (req.session.errors)
         errors=req.session.errors;
         req.session.errors=null;
       Product.findById(req.params.id,function(err,p){
           if(err){
               console.log(err);
               res.redirect('/vendor')
           }
           else{
               res.render('vendor/modify_product',{
                   title : p.title,
                   errors: errors,
                   description:p.description,
                   category:p.category,
                   price :p.price,
                   image :p.image,
                   id :p._id,
                   name : res.locals.user.name
                });
           }
       });
         
   
})
// post modify product
router.post('/modify-product/:id',function(req,res){
    //var imageFile =typeof req.files.image !=="undefined" ? req.files.image.name :"";

    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('description','Content must have a value').notEmpty();
    req.checkBody('price','Price must have a value').isDecimal();
   // req.checkBody('image','you must upload image').isImage(imageFile);

    var title =req.body.title;
    var slug= title.replace(/\s+/g,'-').toLowerCase();
    var description =req.body.description;
    var price =req.body.price;
    var category =req.body.category;
    var image =req.body.image;
    var id =req.params.id;
    var errors =req.validationErrors();
    if (errors){
        req.session.errors= errors;
        res.redirect('/vendor/modify-product'+id);
    } else{
        Product.findOne({slug:slug,_id:{'$ne':id}},function(err,p){
            if(err) console.log(err);
            if(p){
                req.flash('error','product title exists ,choose another');
                res.redirect('/vendor/modify-product'+id);
            }
            else{
                Product.findById(id,function(err,p){
                    if(err) console.log(err);
                    p.title=title;
                    p.slug=slug;
                    p.description=description;
                    p.price=price;
                    p.image=image;
                    p.category=category;
                    p.save(function(err){
                    if(err) console.log(err);
                    console.log('sucess');
                    req.flash('error','product modified');
                    res.redirect('/vendor');
                    });
                });
            }
        });
    }
    
    
      

})

//get delete product
router.get('/delete-product/:id',isVendor,function(req,res){
    var id =req.params.id;
    Product.findByIdAndRemove(id,function(err){
        console.log(err);
 });
     req.flash('error','deleted');
    res.redirect('/vendor');

})



//export
module.exports = router;
