const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

exports.createMessage = async (req, res) => {
    const newMessage = new Message({
        conversationId: req.body.conversationId,
        userId: req.user._id,
        desc: req.body.desc,
    });

    try {
        const savedMessage = await newMessage.save();

        // Update conversation with last message and mark as unread for recipient
        await Conversation.findOneAndUpdate(
            { id: req.body.conversationId },
            {
                $set: {
                    lastMessage: req.body.desc,
                    readBySeller: req.user.role === "freelancer", // User reading their own msg
                    readByBuyer: req.user.role !== "freelancer", // User reading their own msg
                },
            },
            { new: true }
        );

        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
