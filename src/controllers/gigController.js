const Gig = require('../models/Gig');

exports.createGig = async (req, res) => {
    if (req.user.role !== 'freelancer') {
        return res.status(403).json({ message: 'Only freelancers can create gigs' });
    }

    try {
        console.log("Create Gig Request Body:", req.body);
        const { title, desc, category, price, deliveryTime, features, shortTitle, shortDesc, revisionNumber } = req.body;
        console.log("Received Description:", desc);
        console.log("Received Features:", features);

        // Check for uploaded image
        const coverImage = req.imageUrl;

        if (!coverImage && !process.env.CLOUDINARY_CLOUD_NAME) {
            // If we are in fallback mode and it wasn't set by middleware (should have been)
            // This is just a safety check, middleware usually handles it.
        }

        if (!coverImage) {
            return res.status(400).json({ message: 'Cover image is required' });
        }

        const gig = await Gig.create({
            title,
            description: desc,
            category,
            price,
            deliveryTime,
            features: Array.isArray(features) ? features : (features ? features.split(',') : []),
            coverImage,
            shortTitle,
            shortDesc,
            revisionNumber,
            seller: req.user._id
        });

        res.status(201).json(gig);
    } catch (error) {
        console.error("Error creating gig:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getGigs = async (req, res) => {
    const { category, min, max, search, sort } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (req.query.userId) filters.seller = req.query.userId;

    if (min || max) {
        filters.price = {};
        if (min) filters.price.$gte = Number(min);
        if (max) filters.price.$lte = Number(max);
    }


    if (search) {
        filters.title = { $regex: search, $options: 'i' };
    }

    try {
        const sortOptions = {};
        if (sort === 'lowest') sortOptions.price = 1;
        else if (sort === 'highest') sortOptions.price = -1;
        else if (sort === 'sales') sortOptions.sales = -1;
        else sortOptions.createdAt = -1; // Default newest

        const gigs = await Gig.find(filters).populate('seller', 'username profile.profilePicture').sort(sortOptions);
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('seller', 'username profile.bio profile.skills profile.profilePicture rating');
        if (!gig) return res.status(404).json({ message: 'Gig not found' });
        res.json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) return res.status(404).json({ message: 'Gig not found' });

        if (gig.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only delete your own gig' });
        }

        await Gig.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Gig has been deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
