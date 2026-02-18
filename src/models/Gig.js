const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    deliveryTime: {
        type: Number, // In days
        required: true
    },
    features: [{
        type: String
    }],
    shortTitle: {
        type: String,
        required: true
    },
    shortDesc: {
        type: String,
        required: true
    },
    revisionNumber: {
        type: Number,
        required: true
    },
    sales: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gig', gigSchema);
