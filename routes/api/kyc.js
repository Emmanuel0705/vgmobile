const express = require("express");
const { getKyc, updateKyc, createKyc } = require("../../controllers/kyc");
const router = express.Router();
const auth = require("../../middleware/auth");

router
    .route("/")
    .get(auth, getKyc)
    .patch(auth, updateKyc)
    .post(auth, createKyc);

module.exports = router;
