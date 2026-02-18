const mongoose = require('mongoose');
const Gig = require('./models/Gig');
const dotenv = require('dotenv');

dotenv.config();

const checkPrice = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workora');
        console.log("Connected to DB");

        // Find the most recent gig
        const latestGig = await Gig.findOne().sort({ createdAt: -1 });

        if (latestGig) {
            console.log("Latest Gig Details:");
            console.log(`- Title: ${latestGig.title}`);
            console.log(`- Price: ${latestGig.price}`);
            console.log(`- Delivery Time: ${latestGig.deliveryTime}`);
            console.log(`- Revision Number: ${latestGig.revisionNumber}`);
            console.log(`- Created At: ${latestGig.createdAt}`);
        } else {
            console.log("No gigs found.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkPrice();
