const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const {
    getUser,
    loginUser,
    allUsers,
    registerUser,
    getRefUsers,
    updateProfile,
} = require("../../controllers/user");

router.route("/").post(registerUser).patch(auth, updateProfile);
router.route("/login").post(loginUser);
router.route("/auth").get(auth, getUser);
router.route("/all").get(allUsers);
router.route("/refs").get(auth, getRefUsers);

module.exports = router;
