const rateLimit = require("express-rate-limit");

const rateLimiterForAPI = rateLimit({
  windowMs: 60000, // 1 minute in milliseconds
  max: 500,
  headers: false,
  handler: function (req, res, next) {
    return res.status(429).json({
      error:
        "You've exceeded the number of attempts. Please try again after some time.",
    });
    next();
  },
});

const rateLimiterForWeb = rateLimit({
  windowMs: 60000, // 1 minute in milliseconds
  max: 500,
  headers: false,
  handler: function (req, res, next) {
    return res
      .status(429)
      .send(
        "You've exceeded the number of attempts. Please try again after some time."
      );
    next();
  },
});

module.exports = {
  rateLimiterForAPI: rateLimiterForAPI,
  rateLimiterForWeb: rateLimiterForWeb,
};
