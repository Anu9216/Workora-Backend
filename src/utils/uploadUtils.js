const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary Storage
const streamifier = require('streamifier');

// Use Memory Storage instead of CloudinaryStorage to skip the middleware issues
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
    if (!req.file) return next();

    async function upload(req) {
        try {
            console.log(`DEBUG: Starting Base64 Upload. File: ${req.file.originalname}`);

            // Convert buffer to Base64
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

            // Use unsigned_upload to bypass signature issues
            const result = await cloudinary.uploader.unsigned_upload(dataURI, "workora", {
                resource_type: 'auto',
                // folder: 'workora_uploads' 
            });

            console.log("DEBUG: Base64 Upload Success:", result.secure_url);
            req.imageUrl = result.secure_url;
            next();
        } catch (error) {
            console.error("DEBUG: Base64 Upload Failed:", error);
            res.status(500).json({ message: "Image upload failed", error: error.message || "Unknown Cloudinary Error" });
        }
    }

    upload(req);
};

module.exports = { upload, uploadMiddleware };
