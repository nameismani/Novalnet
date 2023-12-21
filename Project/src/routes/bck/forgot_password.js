const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.render("forgot-password", {
    title: "Forgot password",
    session: req.session,
  });
});

module.exports = router;
