const Conversation = require("../models/Conversation");

exports.getConversations = async (req, res) => {
    try {
        // Fetch conversations where current user is either seller or buyer
        const conversations = await Conversation.find(
            req.user.role === "freelancer" ? { sellerId: req.user._id } : { buyerId: req.user._id }
        ).sort({ updatedAt: -1 });
        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createConversation = async (req, res) => {
    const newConversation = new Conversation({
        id: req.user.role === "freelancer" ? req.user._id + req.body.to : req.body.to + req.user._id,
        sellerId: req.user.role === "freelancer" ? req.user._id : req.body.to,
        buyerId: req.user.role === "freelancer" ? req.body.to : req.user._id,
        readBySeller: req.user.role === "freelancer",
        readByBuyer: req.user.role === "client", // Corrected to "client" based on role usage
        // Note: Creating a conversation implies "read" by the creator initially? 
        // Actually, Fiverr logic: if I create it, I've read it. If I send a message, I've read it.
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(201).json(savedConversation);
    } catch (err) {
        if (err.code === 11000) {
            // Uniqueness violation - conversation already exists
            // Return existing one? Or just 200 OK with ID?
            // For now, let's try to fetch and return it for idempotency convenience
            try {
                const existing = await Conversation.findOne({ id: newConversation.id });
                return res.status(200).json(existing);
            } catch (e) {
                return res.status(500).json({ message: e.message });
            }
        }
        res.status(500).json({ message: err.message });
    }
};

exports.getSingleConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ id: req.params.id });
        if (!conversation) return res.status(404).json({ message: "Conversation not found!" });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateConversation = async (req, res) => {
    try {
        const updatedConversation = await Conversation.findOneAndUpdate(
            { id: req.params.id },
            {
                $set: {
                    // Mark as read based on who is requesting
                    ...(req.user.role === "freelancer" ? { readBySeller: true } : { readByBuyer: true }),
                },
            },
            { new: true }
        );
        res.status(200).json(updatedConversation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
