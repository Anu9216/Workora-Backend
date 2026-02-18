const express = require("express");
const { deleteUser, getUser, updateUser } = require("../controllers/userController.js");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.delete("/:id", checkAuth, deleteUser);
router.get("/:id", getUser);
router.put("/", checkAuth, updateUser); // Update current user, no ID needed in URL if from token, but standard REST might use /:id or /me

module.exports = router;
