var mongoose = require('mongoose');



var UserSchema = mongoose.Schema({
    name: {type: String,required: true},
    email: {type: String,required:true},
    username: {type: String,required:true},
    password: {type: String,required:true},
    
    vendor:{type:Number}
});
UserSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
var User = module.exports = mongoose.model('User', UserSchema);