const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'workora_uploads', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Allowed file formats
        public_id: (req, file) => {
            // Generate a unique filename using timestamp and random number
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            // Remove extension from original name as Cloudinary adds it automatically based on format
            const name = file.originalname.split('.')[0];
            return `${name}-${uniqueSuffix}`;
        },
    },
});

const upload = multer({ storage: storage });

// Middleware to expose the Cloudinary URL
const uploadMiddleware = (req, res, next) => {
    if (!req.file) return next();

    // Cloudinary returns the URL in req.file.path
    req.imageUrl = req.file.path;

    next();
};

module.exports = { upload, uploadMiddleware };
