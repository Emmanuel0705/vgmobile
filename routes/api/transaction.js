const express = require("express");
const router = express.Router();
const {buyAirtime,buyData,cableTV,fundWallet} = require('../../controllers/transaction')
const auth = require("../../middleware/auth")

router.route("/buy-airtime").post(buyAirtime)
router.route("/buy-data").post(buyData)
router.route("/fund-wallet").post(auth,fundWallet)
router.route("/cable-tv").post(cableTV)

module.exports = router;  