const express = require("express");
const {
    getConversations,
    createConversation,
    getSingleConversation,
    updateConversation,
} = require("../controllers/conversationController");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/", checkAuth, getConversations);
router.post("/", checkAuth, createConversation);
router.get("/single/:id", checkAuth, getSingleConversation);
router.put("/:id", checkAuth, updateConversation);

module.exports = router;
