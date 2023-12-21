const express = require('express')
const app = express()
const path = require('path')
const rq = require('request-promise')
const route =require('./Route/route')
const session =require('express-session')
const time = 1000 * 60 * 30
const cookies = require('cookie-parser')
app.set('view engine','ejs')
app.use(session({
  secret:'thismysecretkey',
  saveUninitialized:true,
  cookie: { maxAge: time,httpOnly:true },
  resave: false

}))

app.use(cookies())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())






app.use('/',route)


app.listen(8000)
// how to get componey details in webscraping node js?