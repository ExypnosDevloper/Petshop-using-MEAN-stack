var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');
var Product = require('../models/product');
var User = require('../models/user');


var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function (err, orders) {
        if(err){
            return res.write('Error');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
            res.render('user/profile', {orders: orders });
    });
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.get('/admin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/sign-admin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.get('/manage', function (req, res, next) {
    res.render('user/manage',{csrfToken: req.csrfToken()});
});

router.post('/admin', function(req, res, next){
   var email = req.body.email;
   var pass = req.body.password;
   console.log(email);
   console.log(pass);
   if(email === 'admin' && pass === 'admin'){

       res.redirect('/user/manage');
   }
   else {

      res.redirect('/user/signin');
   }

});



router.post('/admin/addP', function(req, res, next){
    var product = new Product();
     product.imagePath = req.body.imagepath;
     product.title = req.body.title;
     product.description = req.body.desc;
     product.price = req.body.price;
     product.save(function (err, result) {
        if(err){
            return err;
        }
         res.redirect('/user/manage');
     });

});

router.post('/admin/delP', function(req, res, next){
    var title = req.body.title;
    var query = {title: title};
    Product.deleteOne( query, function (err, result) {
        if(err){
            console.log("delete failed");
            return err;

        }
        console.log("1 document deleted");
        res.redirect('/user/manage');
    });

});

router.post('/admin/showO', function(req, res, next){

    Order.find( function (err, orders) {
        if(err){
            return res.write('Error');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/manage', { orders: orders });
    });

    // var chunk = [];
    // var big = {};
    // var Bchunk = [];
    // Order.find(async function (err, result) {
    //     count = 0;
    //     for(i in result) {
    //             await User.findOne({'_id':result[count].user},function (err,success) {
    //                 if(err){
    //                     console.log(err);
    //                 }
    //                var uname = success.username;
    //                 big.uname= uname;
    //             });
    //          for (x in result[count].cart.items) {
    //              chunk.push(result[count].cart.items[x].item.title);
    //              var tp = result[count].cart.totalPrice;
    //              big.chunk = chunk;
    //              big.tp = tp;
    //
    //             }
    //
    //          console.log(big);
    //         console.log(count);
    //          Bchunk[count] = big;
    //         console.log(Bchunk);
    //         count++;
    //          chunk = [];
    //
    //     }
    //
    //     res.render('user/manage', { Bchunk: Bchunk });
    // });
});



router.use('/', notLoggedIn,function (req, res, next) {
   next();
});
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup',{
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldURL){
        var oldUrL = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldUrL);

    } else{
        res.redirect('/user/profile');
    }
});


router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin',{
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldURL){
        var oldUrL = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldUrL);
    } else{
        res.redirect('/user/profile');
    }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}