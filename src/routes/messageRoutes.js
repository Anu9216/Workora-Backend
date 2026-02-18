const express = require("express");
const {
    createMessage,
    getMessages,
} = require("../controllers/messageController");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post("/", checkAuth, createMessage);
router.get("/:id", checkAuth, getMessages);

module.exports = router;
