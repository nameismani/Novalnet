const express=require('express')
const get_route = require('./Routes/route')
const bodyParser = require('body-parser')


const session = require('express-session')
const cookies = require('cookie-parser')
const time = 1000 * 60 * 30
const app =express()

const db= require('./database/database')

app.use(session({
    secret:'thismysecretkey',
    saveUninitialized:true,
    cookie: { maxAge: time,httpOnly:true },
    resave: false

}))

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static('public'))



app.use('/',get_route)

app.use(cookies())



app.listen(8080)  //open port