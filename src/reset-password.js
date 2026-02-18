const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const resetPassword = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const user = await User.findOne({ username: 'User_123' });
        if (!user) {
            console.log('User_123 not found.');
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash('123456', salt);
        await user.save();

        console.log('Password for User_123 has been reset to: 123456');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPassword();
