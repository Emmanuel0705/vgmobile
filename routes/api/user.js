const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const {
    getUser,
    loginUser,
    allUsers,
    registerUser,
} = require("../../controllers/user");

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/auth").get(auth, getUser);
router.route("/all").get(allUsers);

module.exports = router;
