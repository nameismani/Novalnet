const express = require("express");
const router = express.Router();

router.all("/", async (req, res, next) => {
  res.render("dashboard", { title: "Dashboard", session: req.session });
});

module.exports = router;
