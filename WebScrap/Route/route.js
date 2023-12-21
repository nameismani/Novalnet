const express = require('express')
const route = express.Router()
const path = require('path')
const cheerio = require('cheerio')
const axios = require('axios')
const https = require('https')
const whois = require('whois')
const { form_post } = require('./route_functions/company_post')



const auth=(req,res,next)=>{
  if(req.session.url_input){
    next()
  }else{
    res.redirect('/')
  }
}
route.get('/', (req,res)=>{

  
    res.render(path.join(__dirname,'../view/home.ejs'))
})

route.post('/checkvalidate',(req,res)=>{
  const {url_input} = req.body
  
  https.get(url_input,(result,err)=>{
        const status_code =result.statusCode
        req.session.url_input = url_input
        res.json({
          status:200,
          message:'Success'
        })
  }).on('error',()=>{
    res.json({
      status:400,
      message:"URL Not Found"
    })
  })
})

route.get('/companyDetails',auth,form_post)

module.exports =route








