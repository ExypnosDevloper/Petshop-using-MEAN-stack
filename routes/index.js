var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Access = require('../models/access');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    res.render('shop/index', {successMsg: successMsg, noMessages: !successMsg});
});

router.get('/buy', function(req, res, next) {

  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize =3;
    for(var i = 0; i< docs.length; i+=chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
      console.log(12+8);
    }
    res.render('shop/buy', { title: 'Shopping cart', products: productChunks });
      console.log(420);
  });
});

router.get('/access', function(req, res, next) {

    Access.find(function (err, docs) {
        var productChunks = [];
        var chunkSize =3;
        for(var i = 0; i< docs.length; i+=chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
            console.log(12+8);
        }
        res.render('shop/access-buy', { title: 'Shopping cart', products: productChunks });
        console.log(420);
    });
});

router.get('/adopt', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize =3;
        for(var i = 0; i< docs.length; i+=chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/adopt', { title: 'Shopping cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
    });
});


router.get('/add-to-cart/:id', function (req,res, next) {
  var productId = req.params.id;
  var x = productId.slice(0,5);
  var cart = new Cart(req.session.cart ? req.session.cart: {});

  if(x == '5c895'){
        Product.findById(productId, function (err, product) {
            if(err){
                console.log(err);
                return res.redirect('/');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/buy');
        });
    }
  else{
        Access.findById(productId, function (err, product) {
            if(err){
                return res.redirect('/access');
            }
            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/access');
        });
    }
});


router.get('/shopping-cart', function (req, res, next) {
   if(!req.session.cart){
       return res.render('shop/shopping-cart', {products: null});
   }
   var cart = new Cart(req.session.cart);
   res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout',{total: cart.totalPrice, errMsg:errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var stripe = require("stripe")("sk_test_XW8qronKnrCVu1KBgmvOEt8F");

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: "tok_mastercard", // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function (err, result) {
            req.flash('success','Purchase Successfull!!!!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldURL = req.url;
    res.redirect('/user/signin');
}
