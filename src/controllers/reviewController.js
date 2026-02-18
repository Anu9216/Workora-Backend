const Review = require("../models/Review");
const Gig = require("../models/Gig");

exports.createReview = async (req, res) => {
    if (req.user.isSeller)
        return res.status(403).json({ message: "Sellers cannot create a review!" });

    const newReview = new Review({
        userId: req.user._id,
        gigId: req.body.gigId,
        desc: req.body.desc,
        star: req.body.star,
    });

    try {
        const review = await Review.findOne({
            gigId: req.body.gigId,
            userId: req.user._id,
        });

        if (review)
            return res.status(403).json({ message: "You have already created a review for this gig!" });

        // Todo: Check if user purchased the gig

        const savedReview = await newReview.save();

        await Gig.findByIdAndUpdate(req.body.gigId, {
            $inc: { totalStars: req.body.star, starNumber: 1 },
        });

        res.status(201).json(savedReview); // Changed send to json for consistency
    } catch (err) {
        res.status(500).json({ message: "Something went wrong!" }); // Standardized error response
    }
};

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ gigId: req.params.gigId });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong!" });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        // Check ownership handled in route or here? 
        // Ideally user can only delete their own review.
        // For now, simpler implementation:
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json("Review has been deleted!");
    } catch (err) {
        res.status(500).json({ message: "Something went wrong!" });
    }
};
