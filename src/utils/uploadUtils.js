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

    const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'workora_uploads',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        try {
            const result = await streamUpload(req);
            console.log("DEBUG: Manual Upload Success:", result.secure_url);
            req.imageUrl = result.secure_url;
            next();
        } catch (error) {
            console.error("DEBUG: Manual Upload Failed:", error);
            res.status(500).json({ message: "Image upload failed", error: error.message });
        }
    }

    upload(req);
};

module.exports = { upload, uploadMiddleware };
