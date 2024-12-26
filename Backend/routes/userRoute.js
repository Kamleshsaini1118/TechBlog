const express = require("express")
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")


// IMPORT THE CONTROLLERS
const { registerUser, loginUser, logoutUser } = require("../controllers/userController");

// ROUTES FOR REGISTER A USER AND LOGIN A USER.
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser)

module.exports = router;