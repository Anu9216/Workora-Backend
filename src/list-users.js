const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const listUsers = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const users = await User.find({}, 'username email isSeller');

        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.log('--- Registered Users ---');
            users.forEach(u => {
                console.log(`Username: ${u.username} | Email: ${u.email} | IsSeller: ${u.isSeller}`);
            });
            console.log('------------------------');
            console.log('NOTE: Passwords are encrypted and cannot be retrieved.');
            console.log('If you forgot your password, I can reset it for you.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
