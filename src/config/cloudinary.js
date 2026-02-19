const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("DEBUG: Cloudinary Config...");
console.log(`DEBUG: Cloud Name: ${cloudName}`);
console.log(`DEBUG: API Key: ${apiKey ? `${apiKey.substring(0, 4)}... (Length: ${apiKey.length})` : "MISSING"}`);
console.log(`DEBUG: API Secret: ${apiSecret ? `${apiSecret.substring(0, 4)}... (Length: ${apiSecret.length})` : "MISSING"}`);

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
});

// Test connection immediately
cloudinary.api.ping((error, result) => {
    if (error) {
        console.error("DEBUG: Cloudinary Ping Failed!", error);
    } else {
        console.log("DEBUG: Cloudinary Ping Success!", result);
    }
});

module.exports = cloudinary;
