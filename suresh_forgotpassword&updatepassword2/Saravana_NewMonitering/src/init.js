/* 
Project: Novalnet Monitoring Portal
Date: 27.04.2023
*/

const path = require("path");
const express = require("express");
const sessions = require("express-session");
const helmet = require("helmet"); // Security headers 
const dotenv = require('dotenv');
const ejs = require("ejs");
const lang = require("multi-lang")("./languages/lang.json", "en", false);
const db = require('./middlewares/dbConnection.js');
const MariaDBStore = require('express-session-mariadb-store');
const nodemailer = require('nodemailer');
const nocache = require('nocache');
var uuid = require('uuid');
const util = require("./util.js");
const cookieParser = require('cookie-parser')
const app = express()
const PORT = 2231;
process.env.TZ = "Europe/Berlin";

// Define paths for Express config
const mediaDirectoryPath = path.join(__dirname, '../media');
const viewsPath = path.join(__dirname, '../templates/views');

dotenv.config({
    path: path.resolve(__dirname, 'monitor.env')
});
app.use(cookieParser())
// Mail Transporter
var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    //port: process.env.EMAIL_PORT,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_U,
        pass: process.env.EMAIL_P
    }
});
app.set('nmp_mailer', transporter);
app.use(nocache());

app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.set('nmp_ejs', ejs);
app.set('locale', lang);
// set database connection in app
//~ app.set('novalnet_db', db.novalnet);
//~ app.set('nmp_db', db.monitor);

const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
// enable this if you run behind a proxy (e.g. nginx)
app.set('trust proxy', 1);

//session middleware
app.use(sessions({
    genid: function (req) {

        return uuid.v1() // use UUIDs for session IDs
    },
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: {
        //~ httpOnly : false, 
        //~ path: '/',
        //~ secure: false,
        //~ sameSite: "none",
        //~ domain: 'monitor.novalnet.de', 
        // expires: expiryDate,
        maxAge: 60 * 60 * 1000,
    },
    store: new MariaDBStore({
        pool: db.monitor
    }),
    resave: false
}));

app.use(express.static(mediaDirectoryPath, {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        const hashRegExp = new RegExp('(\.css|\.js|\.webp|\.jpg|\.js|\.png|\.ico|\.svg)');

        if (hashRegExp.test(path)) {
            // If the RegExp matched, then set 48 hours caches
            res.setHeader('Cache-Control', 'max-age=2880');
        }
    }
}))
// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieAuth = (req, res, next) => {
    try {
        console.log('login', req.cookies);
        let cookieState = util.decryption(req.cookies.login)
        if (cookieState == 'true') {

            next()
        }
        else {
            req.session.destroy()
            res.clearCookie("login", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });
            res.writeHead(301, { location: "/" });
            res.end();
        }
    } catch (err) {
        console.log(err);
        req.session.destroy()
        res.clearCookie("login", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
        res.writeHead(301, { location: "/" });
        res.end();
    }

}

const sessionAuth = (req, res, next) => {
    console.log(req.session);
    if (req.session.loggedin) {
        res.locals.user = req.session;
        console.log(res.locals)
        console.log("sessionAuth in");
        next();
    } else {
        console.log("sessionAuth else")
        res.writeHead(301, { location: "/" });
        res.end();
    }
};

const sessionAccountLock = (req, res, next) => {
    if (req.session.accountlock) {
        res.writeHead(301, { location: "/inactivity" });
        res.end();
    } else {
        if (req.method == 'GET') {
            req.session.previousUrl = req.headers.referer
            req.session.currentUrl = req.originalUrl;
        }
        next();
    }
};

const session_hold = (req, res, next) => {
    if (req.session.hold == true) {

        if (req.method == "GET") {
            req.session.hold = false
            res.writeHead(301, { location: '/logout' })
            res.end()
        }
        else {
            return res.json({
                status: 104,
                status_desc: "Failure for session end"
            })
        }
        // res.redirect('/logout')

        // res.writeHead(301,{location:req.session.currentUrl})
        // res.end()
    } else {
        next()
    }
}

module.exports = {
    "app": app,
    "port": PORT,
    "lang": lang,
    externalsType: 'module',
    externals: {
        chart: require('chart.js/auto'),
    },
    "sessionAuth": sessionAuth,
    "sessionAccountLock": sessionAccountLock,
    "cookieAuth": cookieAuth,
    "session_hold": session_hold,
}
