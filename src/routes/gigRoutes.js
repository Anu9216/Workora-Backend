const express = require('express');
const router = express.Router();
const { createGig, getGigs, getGig, deleteGig } = require('../controllers/gigController');
const checkAuth = require('../middleware/checkAuth');
const roleMiddleware = require('../middleware/roleMiddleware');
const { upload, uploadMiddleware } = require('../utils/uploadUtils');

router.post(
    '/',
    checkAuth,
    roleMiddleware('freelancer'),
    upload.single('image'),
    uploadMiddleware,
    createGig
);

router.get('/', getGigs);
router.get('/:id', getGig);
router.delete('/:id', checkAuth, deleteGig);

module.exports = router;
