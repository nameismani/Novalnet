const createError = require("http-errors");
const express = require("express");
const path = require("path");
const db = require("./middleware/database.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const sessions = require("express-session");
const MariaDBStore = require("express-session-mariadb-store");
const nodemailer = require("nodemailer");

const nocache = require("nocache");
const uuid = require("uuid");
const ejs = require("ejs");

const app = express();

app.use(nocache());

// Define paths for Express config
const mediaDirectoryPath = path.join(__dirname, "../media");
const viewsPath = path.join(__dirname, "../templates/views");

// view engine setup
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.set("nmp_ejs", ejs);

app.set("trust proxy", 1);

// set database connection in app
app.set("db", db);

// creating 2 hour cookie expiry
const expiryDate = new Date(Date.now() + 8 * 60 * 60 * 1000);

//session middleware
app.use(
  sessions({
    genid: function (req) {
      return uuid.v1(); // use UUIDs for session IDs
    },
    secret: "csbsshsbctekeyfdsjsb36124454",
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "strict",
      domain: "dev9.fobits.de",
      expires: expiryDate,
    },
    store: new MariaDBStore({
      pool: db,
    }),
    resave: false,
  })
);

app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({
    extended: false,
    limit: "100mb",
    parameterLimit: 1000000,
  })
);
app.use(bodyParser.json({ limit: "200mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// check for user session
const sessionAuth = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.user = req.session;
    console.log("sessionAuth in");
    next();
  } else {
    console.log("sessionAuth else");
    res.writeHead(301, { location: "/" });
    res.end();
  }
};

// Mail Transporter
var transporter = nodemailer.createTransport({
  host: "mail1.novalnetsolutions.com",
  port: 587,
  secure: false, // use SSL
  auth: {
    user: "charles_a@novalnetsolutions.com",
    pass: "aE23HYzFOsfaMNOxSds",
  },
});

app.set("mailer", transporter);

// app.set('multer',upload)

// Setup static directory to serve
// app.use(express.static(mediaDirectoryPath, {
//     etag: true,
//     lastModified: true,
//     setHeaders: (res, path) => {
//       const hashRegExp = new RegExp('(\.css|\.js|\.webp|\.jpg|\.js|\.png|\.ico|\.svg)');

//       if (hashRegExp.test(path)) {
//         // If the RegExp matched, then set 48 hours caches
//         res.setHeader('Cache-Control', 'max-age=2880');
//       }
//     }
// }))
app.use(express.static(mediaDirectoryPath));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = {
  app: app,
  sessionAuth: sessionAuth,
};
