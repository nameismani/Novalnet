const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const route = require('./Router/route')
const body_parser = require('body-parser')
const sql = require('./Model/database')
const session = require('express-session')
const cookies = require('cookie-parser')
const time = 1000 * 60 * 30
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload')

dotenv.config()

app.use(fileUpload())

app.set('view engine','ejs') // set function

app.use(express.static('public'))

app.use(session({
    secret:process.env.SESSION_SECRET_KEY,
    saveUninitialized:true,
    cookie: { maxAge: time,httpOnly:true },
    resave: false

}))

app.use(cookies())

app.use(body_parser.urlencoded({extended:true}))
app.use(body_parser.json())

app.use('/',route)

app.listen(port)
