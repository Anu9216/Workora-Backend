const express = require("express");
const { createReview, getReviews, deleteReview } = require("../controllers/reviewController");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post("/", checkAuth, createReview);
router.get("/:gigId", getReviews);
router.delete("/:id", deleteReview);

module.exports = router;
