const router = require("express").Router();
const image = require("./image");
const auth = require("./auth");

router.get("/", async (req, res) => {
  res.status(200).json({ message: domainName });
});

router.use("/image", image);
router.use(auth);

module.exports = router;
