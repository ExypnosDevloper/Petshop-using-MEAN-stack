var Product = require('../models/access');

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
        imagePath:'images/access/bed.jpg',
        title: 'Bed',
        description: 'Buy Dog beds, Designer Dog beds, Luxury Dog Beds, Puppy mattress online at best price in India',
        price: '50'
    }),
    new Product({
        imagePath:'images/access/collar.jpg',
        title: 'Collar',
        description: 'A dog collar is a piece of material put around the neck of a dog. A collar may be used for restraint, identification, fashion, or other purposes. Identification tags and medical information are often placed on dog collars.',
        price: '12'
    }),
    new Product({
        imagePath:'images/access/house.jpg',
        title: 'House',
        description: 'A doghouse, dog house, dogshed or kennel is a small shed commonly built in the shape of a house, a shelter intended for a dog. It is a structure in which a dog is kept and it is intended to provide a safe place to dogs outdoors.',
        price: '120'
    }),
    new Product({
        imagePath:'images/access/id.jpg',
        title: 'Tag',
        description: '"Dog tag" is an informal but common term for a specific type of identification tag worn by military personnel.',
        price: '7'
    }),
    new Product({
        imagePath:'images/access/stand.jpg',
        title: 'Bowl stand',
        description: 'Raised dog food bowls, which are also commonly known as elevated feeders, are typically not needed for pets, according to veterinarian Jon Gellar. Not only do dogs generally not need to eat from bowls that are raised high off the floor, these feeders are in some cases thought to be detrimental to them.',
        price: '45'
    }),
    new Product({
        imagePath:'images/access/tub.jpg',
        title: 'Tub',
        description: 'A portable doggy tub is also an option. While some tubs are made of heavy plastic, others are collapsible and can easily be used outside or in the laundry room or mudroom',
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
