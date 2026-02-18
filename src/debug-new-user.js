const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const debugNewUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workora');
        console.log("Connected to DB");

        // Get the absolute latest user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (user) {
            console.log("LATEST USER DEBUG:");
            console.log(`- Username: ${user.username}`);
            console.log(`- Email: ${user.email}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- IsSeller: ${user.isSeller}`);
            console.log(`- Created At: ${user.createdAt}`);
        } else {
            console.log("No users found.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugNewUser();
