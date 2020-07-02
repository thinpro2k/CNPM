var mongoose = require('mongoose');

var ProductSchema =mongoose.Schema({
     title:{
         type : String,
         required :true
     },
     description:{
         type: String,
         required :true
     },
     price:{
         type: String,
         required:true
     },
     image:{
        type: String,
     },
     slug:{
        type: String,
         
     },
     category:{
        type: String,
        
     }
});
var Product = module.exports = mongoose.model('Product',ProductSchema);