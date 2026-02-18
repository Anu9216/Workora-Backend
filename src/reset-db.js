const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Gig = require('./models/Gig');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Message = require('./models/Message');

dotenv.config();

const resetDb = async () => {
    try {
        await connectDB();

        console.log('Deleting all data...');

        await User.deleteMany({});
        console.log('Users deleted.');

        await Gig.deleteMany({});
        console.log('Gigs deleted.');

        await Order.deleteMany({});
        console.log('Orders deleted.');

        await Review.deleteMany({});
        console.log('Reviews deleted.');

        await Message.deleteMany({});
        console.log('Messages deleted.');

        console.log('Database reset complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetDb();
