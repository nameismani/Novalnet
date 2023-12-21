const createError = require('http-errors');
const express = require('express');
const path = require('path');
const db = require('./middleware/database.js');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sessions = require("express-session");
const MariaDBStore = require('express-session-mariadb-store');
const nodemailer = require('nodemailer');
const nocache = require('nocache');
const uuid = require('uuid');

const app = express();

app.use(nocache()); 

// Define paths for Express config
const mediaDirectoryPath = path.join(__dirname, '../media')
const viewsPath = path.join(__dirname, '../templates/views')

// view engine setup
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.set('trust proxy', 1);

// set database connection in app
app.set('db', db);

// creating 2 hour cookie expiry 
const expiryDate = new Date(Date.now() + (8 * 60) * 60 * 1000);

//session middleware
app.use(sessions({
    genid: function(req) {
        return uuid.v1() // use UUIDs for session IDs
    },
    secret: "csbsshsbctekeyfdsjsb36124454", 
    saveUninitialized: false,
    cookie: {
        httpOnly : true,
        path: '/',
        secure: false,
        sameSite: "strict",
        domain: 'dev5.fobits.de',
        expires: expiryDate
    },
    store: new MariaDBStore({
        pool: db
    }),
    resave: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// check for user session
const sessionAuth = (req, res, next) => {

     if(req.session.loggedin) { 
        res.locals.user = req.session;
        console.log("sessionAuth in")
          next();
    }else { 
        console.log("sessionAuth else")
        res.writeHead(301, { location: "/"  });
        res.end();  
    }
};

// Check for user active or not
const checkUserActivity = (req,res,next) => {
   if(req.session.checkUserActivity.inActiveUser){
    console.log("user_inactive")
    res.writeHead(301, { location: "/lockout/page"  });
    res.end()
   }else{
       next()
   }
}

// Mail Transporter
var transporter = nodemailer.createTransport({
    host: 'mail1.novalnetsolutions.com',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: 'charles_a@novalnetsolutions.com',
        pass: 'aE23HYzFOsfaMNOxSds'
    }
});

app.set('mailer', transporter)

// Setup static directory to serve 
app.use(express.static(mediaDirectoryPath))

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

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
    "app": app,
    "sessionAuth": sessionAuth,
    "checkUserActivity":checkUserActivity,
}
