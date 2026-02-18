const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const fixIsSeller = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workora');
        console.log("Connected to DB");

        // Find the most recent user
        const latestUser = await User.findOne().sort({ createdAt: -1 });

        if (latestUser) {
            console.log(`Found user: ${latestUser.username} (${latestUser.email})`);

            // Set isSeller based on role
            if (latestUser.role === 'freelancer') {
                latestUser.isSeller = true;
                await latestUser.save();
                console.log(`UPDATED user isSeller: true`);
            } else {
                console.log(`User role is ${latestUser.role}, no change needed.`);
            }

        } else {
            console.log("No users found.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixIsSeller();
