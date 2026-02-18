const mongoose = require('mongoose');
const User = require('./src/models/User');
const Gig = require('./src/models/Gig');
const Order = require('./src/models/Order');
const Review = require('./src/models/Review');
const Conversation = require('./src/models/Conversation');
const Message = require('./src/models/Message');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const deleteFolderRecursive = (directoryPath) => {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        // Optionally keep the directory itself, or remove it. 
        // Let's keep the 'uploads' folder but empty it.
        // fs.rmdirSync(directoryPath); 
    }
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        await User.deleteMany({});
        console.log("Deleted all Users");

        await Gig.deleteMany({});
        console.log("Deleted all Gigs");

        await Order.deleteMany({});
        console.log("Deleted all Orders");

        await Review.deleteMany({});
        console.log("Deleted all Reviews");

        await Conversation.deleteMany({});
        console.log("Deleted all Conversations");

        await Message.deleteMany({});
        console.log("Deleted all Messages");

        // Clear Uploads (assuming e:/Workora/public/uploads based on app.js)
        // If it was client/public/uploads, we'd target that. 
        // Based on app.js: path.join(__dirname, '../public/uploads') -> src/../public/uploads -> root/public/uploads

        const uploadsDir = path.join(__dirname, 'public', 'uploads');
        if (fs.existsSync(uploadsDir)) {
            console.log(`Clearing uploads from: ${uploadsDir}`);
            // We don't want to delete the folder itself if it's needed, just content.
            // Actually, typically in these projects, we might want to keep the directory.
            const files = fs.readdirSync(uploadsDir);
            for (const file of files) {
                fs.unlinkSync(path.join(uploadsDir, file));
            }
            console.log("Uploads cleared.");
        } else {
            console.log("Uploads directory not found at " + uploadsDir);
            // Check client/public/uploads just in case
            const clientUploads = path.join(__dirname, 'client', 'public', 'uploads');
            if (fs.existsSync(clientUploads)) {
                console.log(`Clearing uploads from: ${clientUploads}`);
                const files = fs.readdirSync(clientUploads);
                for (const file of files) {
                    fs.unlinkSync(path.join(clientUploads, file));
                }
                console.log("Client Uploads cleared.");
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
        console.log("Database reset complete.");
    }
};

run();
