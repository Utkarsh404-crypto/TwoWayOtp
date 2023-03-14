const express = require("express");
const { getOtp } = require("../controllers/OtpController");
const router = express.Router();

router.route("/generateAndSendOTP").post(getOtp);

module.exports = router;