const express = require("express");
const {
    getAccount,
    updateAccount,
    createAccount,
} = require("../../controllers/account");
const router = express.Router();
const auth = require("../../middleware/auth");

router
    .route("/")
    .get(auth, getAccount)
    .patch(auth, updateAccount)
    .post(auth, createAccount);

module.exports = router;
