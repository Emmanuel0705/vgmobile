const express = require("express");
const router = express.Router();
const { fundWallet, getTx } = require("../../controllers/transaction");
const auth = require("../../middleware/auth");

router.route("/fund-wallet").post(auth, fundWallet);
router.route("/").get(auth, getTx);

module.exports = router;
