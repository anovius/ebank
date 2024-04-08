let router = require("express").Router();

router.use("/user", require("./users"));
router.use("/transaction", require("./transaction"));
router.use("/asset", require("./asset"));
router.use("/kyc", require("./kyc"));
router.use("/team", require("./team"));
router.use("/blog", require("./blog"));
router.use("/ticket", require("./ticket"));
router.use("/config", require("./config"));
router.use("/upload", require("./upload"));

module.exports = router;
