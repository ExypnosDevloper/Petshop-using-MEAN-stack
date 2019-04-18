var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true }, function(err){
    if(err){
        console.log('Not connected to the database');
    }else{
        console.log('Connection Established !!');
    }
});

var products = [
    new Product({
        imagePath:'/images/Akita.jpg',
        title: 'Akita',
        description: 'The Akita is a large breed of dog originating from the mountainous regions of northern Japan. There are two separate varieties of Akita',
        price: '35'
    }),
    new Product({
        imagePath:'/images/Beagle.jpg',
        title: 'Beagle',
        description: 'The beagle is a breed of small hound that is similar in appearance to the much larger foxhound. The beagle is a scent hound, developed primarily for hunting hare',
        price: '40'
    }),
    new Product({
        imagePath:'/images/Boxer.jpg',
        title: 'Boxer',
        description: 'The Boxer is a medium-sized, short-haired breed of dog, developed in Germany. The coat is smooth and tight-fitting; colors are fawn or brindled, with or without white markings, and white.',
        price: '30'
    }),
    new Product({
        imagePath:'/images/Doberman.jpg',
        title: 'Doberman',
        description: 'The Dobermann, or Doberman Pinscher in the United States and Canada, is a medium-large breed of domestic dog that was originally developed around 1890 by Karl Friedrich Louis Dobermann, a tax collector from Germany.',
        price: '50'
    }),
    new Product({
        imagePath:'/images/Labrador.jpg',
        title: 'Labrador',
        description: 'The Labrador Retriever, or just Labrador, is a large type of retriever-gun dog. The Labrador is one of the most popular breeds of dog in Canada, the United Kingdom and the United States.',
        price: '45'
    }),
    new Product({
        imagePath:'/images/Pug.jpg',
        title: 'Pug',
        description: 'The pug is a breed of dog with physically distinctive features of a wrinkly, short-muzzled face, and curled tail. The breed has a fine, glossy coat that comes in a variety of colours, most often fawn or black, and a compact square body with well-developed muscles.',
        price: '70'
    })
];
var done = 0;
for ( var i = 0; i < products.length; i++) {
    products[i].save(function(err, result){
        if(err){
            console.log(err);
        }

        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();

}

