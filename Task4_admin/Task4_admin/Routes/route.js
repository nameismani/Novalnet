const express = require('express')
const route = express.Router()
const path = require('path')
const fs = require('fs')




const {login_fun} = require('./login_fun')
const {signup_fun} = require('./signup_fun')
const {get_detail_employee} = require('./employee_detail')

const {get_table_view} = require("./get_table_view")
const { delete_details } = require('./delete_details')
const { single_id } = require('./updated_details')
const { update_success } = require('./update_success')

 var session;


const protected_route =(req,res,next)=>{
    
    session = req.session.user
    
    if(session==='admin'){
        next()
    }else if (session === 'user'){
    res.redirect('/user_portal')
    }else{
        res.redirect('/')
    }
    
}

const admin_check =(req,res,next)=>{

    if(req.session.user === req.params.users){
        next()
    }else{
        res.redirect('/')
    }

}

const create_form_admin=(req,res,next)=>{
    if(req.session.user === 'admin'){
        next()
    }else{
        res.redirect('/')
    }

}
const user_portal =(req,res,next)=>{
    if(req.session.user === 'user'){
        next()
    }
    else{
        res.redirect('/')
    }
}

// ------------------navigate to home page -------------------

route.get('/', (req, res) => {
   
   req?.session?.destroy()
    
    res.sendFile(path.join(__dirname, "../view/welcome.html"))
})

// -------------------navigate to login page ---------------

route.get('/login', (req, res) => {
    req?.session?.destroy()
    res.sendFile(path.join(__dirname, "../view/login.html"))
})

// -------------------navigate to signup page --------------

route.get('/signup', (req, res) => {
    req?.session?.destroy()

    res.sendFile(path.join(__dirname, "../view/signup.html"))
})

// -------------------navigate to after successfully submitted a form--------------

route.get('/dash',protected_route, (req, res) => {
    


   
        res.sendFile(path.join(__dirname, "../view/dashboard.html"))
    
      
    
   
})
route.get('/user_portal',user_portal, (req, res) => {
   
    
     
     res.sendFile(path.join(__dirname, "../view/user_portal.html"))
 })


route.get('/dash/create',create_form_admin,(req,res)=>{
    res.sendFile(path.join(__dirname, "../view/create_page.html"))
})

route.get('/dash/view/:users',admin_check,(req,res)=>{
   
   console.log(req.session)
   console.log(req.params)
    res.render(path.join(__dirname,"../view/table_view.ejs"),{token:req.params.users})
    
})
route.get('/dash/update/:id',(req,res)=>{
    res.sendFile(path.join(__dirname,"../view/updated.html"))
})
// -----------------------navigconst db = require('../database/database')ate to page not found -----------------------
route.get('/dash/single_id/:id',single_id)

route.get('/dash/get_table_view',get_table_view)

route.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../view/pageNotFound.html"))
})



// --------------------signup form post ----------------------------------










route.post('/dashboard',signup_fun )

// --------------------login form post ----------------------------------

route.post('/loginuser',login_fun )

route.post('/dash/get_details_employee',get_detail_employee)


route.put('/update/:id',update_success)


route.delete('/dash/delete/:id',delete_details)



module.exports = route