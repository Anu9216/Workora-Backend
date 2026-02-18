const mongoose = require('mongoose');
const User = require('./src/models/User');
const Gig = require('./src/models/Gig');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const users = await User.find({}, '_id username');
        console.log("Users:", users);

        const gigs = await Gig.find({}, 'title seller').populate('seller', 'username');
        console.log("Gigs:", JSON.stringify(gigs, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
};

run();
