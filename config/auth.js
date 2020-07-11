exports.isUser=function(req,res,next){
    if (req.isAuthenticated()){
        next();
    }
    else{
        req.flash('error','please login.');
        res.redirect('/user/login');
    }
}
exports.isVendor=function(req,res,next){
    if (req.isAuthenticated() && res.locals.user.vendor==1){
        next();
    }
    else if (req.isAuthenticated()){
        req.flash('error','you are not vendor.');
        res.redirect('/');
    }
    else{
        req.flash('error','please login as vendor.');
        res.redirect('/user/login');
    }
}