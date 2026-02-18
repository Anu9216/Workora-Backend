const mongoose = require('mongoose');
const User = require('./src/models/User');
const Gig = require('./src/models/Gig');
const Order = require('./src/models/Order');
const Review = require('./src/models/Review');
const Message = require('./src/models/Message');

console.log('Verifying Mongoose Schemas...');

try {
    console.log('User Model:', User.modelName);
    console.log('Gig Model:', Gig.modelName);
    console.log('Order Model:', Order.modelName);
    console.log('Review Model:', Review.modelName);
    console.log('Message Model:', Message.modelName);

    console.log('All schemas loaded successfully.');
} catch (error) {
    console.error('Error loading schemas:', error);
    process.exit(1);
}
