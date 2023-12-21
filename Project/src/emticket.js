const init = require("./init.js");
const api = require("./routes/api.js");
//const forgot_password = require('./routes/forgot_password.js');
//const signup = require('./routes/signup.js');
const dashboard = require("./routes/dashboard.js");
const tickets = require("./routes/tickets.js");
const users = require("./routes/users.js");
const feedback = require("./routes/feedback.js");
const app = init.app;
const sessionAuth = init.sessionAuth;
//const rateLimiterForAPI = init.rateLimiterForAPI;
//const rateLimiterForWeb = init.rateLimiterForWeb;
const port = 2238;

// Index (Login & Signup) page
app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.locals.user = req.session;
    res.writeHead(301, { location: "/tickets" });
    res.end();
  } else {
    req.session.loggedin = false;
    req.session.save();
    req.session.destroy();
    res.render("index", { title: "Ticketing System" });
  }
});

// API Route
app.use("/api/", api);

// Forgot password page
//app.use('/forgot-password', forgot_password)

// Dashboard
app.use("/dashboard", sessionAuth, dashboard);

// Tickets
app.use("/tickets", sessionAuth, tickets);

// Users
app.use("/users", sessionAuth, users);

// feedback

app.use("/feedback", sessionAuth, feedback);

// signup page
//app.use('/signup', signup)

// Listen port config
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
