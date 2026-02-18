const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("Attempting to connect to DB...");
        // Debug: Check if MONGO_URI is loaded (don't log the full string if it contains passwords)
        if (!process.env.MONGO_URI) {
            console.error("FATAL ERROR: MONGO_URI is not defined.");
            process.exit(1);
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
