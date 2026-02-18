const mongoose = require('mongoose');
const User = require('./models/User');
const Gig = require('./models/Gig');
const dotenv = require('dotenv');

dotenv.config();

const debugData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workora');
        console.log("Connected to DB");

        // Get latest user
        const user = await User.findOne().sort({ createdAt: -1 });
        // Get latest gig
        const gig = await Gig.findOne().sort({ createdAt: -1 });

        console.log("DEBUG DATA:");
        if (user) {
            console.log(`User: ${user.username}`);
            console.log(`User ID (String): ${user._id.toString()}`);
            console.log(`User ID (Raw):`, user._id);
        } else {
            console.log("No user found");
        }

        if (gig) {
            console.log(`Gig: ${gig.title}`);
            console.log(`Gig Seller ID (String): ${gig.seller.toString()}`);
            console.log(`Gig Seller ID (Raw):`, gig.seller);
        } else {
            console.log("No gig found");
        }

        if (user && gig) {
            console.log(`Match? ${user._id.toString() === gig.seller.toString()}`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugData();
