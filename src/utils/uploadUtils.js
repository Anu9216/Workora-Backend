const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary Storage
console.log("DEBUG: Cloudinary Config Loaded. Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        // folder: 'workora_uploads', // access control?
        resource_type: 'auto',
        // allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
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
