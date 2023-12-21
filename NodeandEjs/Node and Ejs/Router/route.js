const express = require('express')
const route = express.Router()
const db = require('../Model/user_table')
const emp_tab = require('../Model/emp_table')
const path = require('path')
const {check, param} =require('express-validator')
const {login_fun}=require('./routeFuntions/login_fun')
const { signup_fun } = require('./routeFuntions/signup_fun')
const { create_emp_fun } = require('./routeFuntions/create_emp_fun')
const { delete_fun } = require('./routeFuntions/delete_fun')
const { get_update_id } = require('./routeFuntions/get_update_id')
const { updated_data } = require('./routeFuntions/updated_success')
const { otp_fun } = require('./routeFuntions/otp_fun')
const { get_signup } = require('./routeFuntions/get_signup')
const { refreshCaptcha } = require('./routeFuntions/refresh_captcha')
const { resend_otp } = require('./routeFuntions/resend_otp')
const { forgot_password } = require('./routeFuntions/forgot_pass_fun')
const {  changePassword } = require('./routeFuntions/changePassword')
const jwt = require('jsonwebtoken')
const tokenTime = require('../Model/tokenExpire')
const { ImageUpload } = require('./routeFuntions/imageUpload')
const { NewPasswordUpdate } = require('./routeFuntions/NewPasswordUpdate')
const { delete_Avatar } = require('./routeFuntions/delete_Avatar')
const { nameUpdate } = require('./routeFuntions/nameUpdate')

var session


const validator =()=>{
   const email_check =check('email',"Email is not empty").not().isEmpty()
   const pass_check = check('password',"Password is required").not().isEmpty().isLength({min:8,max:30})
  const isEmail_check = check("email","Email is not valid").isEmail()
   return [email_check,pass_check,isEmail_check]
}

const signup_validator =()=>{
   const email_check =check('email',"Email is not empty").not().isEmpty()
   const pass_check = check('password',"Password is required").not().isEmpty().isLength({min:8,max:30})
  const isEmail_check = check("email","Email is not valid").isEmail()
   const name_check = check('name','name is required').not().isEmpty().not().isNumeric()

  return [name_check,email_check,pass_check,isEmail_check]
}

const param_check=(param_url)=>{
   return [param(param_url).trim().isNumeric()]
}

const auth = (req,res,next)=>{
   if(req.session.email){
      next()
   }else{
      res.redirect('/')
   }
}

const auth_dash = (req,res,next)=>{
   if(req.session.email){
      res.redirect('/dashboard')
   }else{
      next()
   }
}

const otp_auth=(req,res,next)=>{
  

   if(req.session.otp_email){
      next()
   }else{
      res.redirect('/')
   }
}
route.get('/',auth_dash,(req,res)=>{
   res.render(path.join(__dirname,'../view/welcome.ejs'))
})

route.get('/signin',auth_dash,get_signup)

route.get('/signup',auth_dash,(req,res)=>{
   res.render(path.join(__dirname,'../view/signup.ejs'))
})

// route.get('/termsAndPolicy',(req,res)=>{
//    res.render(path.join(__dirname,'../view/termsAndPolicy.ejs'))
// })
route.get('/dashboard',auth,(req,res)=>{


   const query = `SELECT * FROM Users WHERE Email = "${req.session.email}"`
   const select_emp_details = `SELECT emp.id,emp.Emp_name, emp.Email, emp.Designation,emp_det.Doj , emp_det.Dob , emp_det.Gender , emp_det.Comment FROM Emp_Table AS emp JOIN Emp_Details AS emp_det ON emp.id=emp_det.id `
   emp_tab.query(select_emp_details,(err,response)=>{
      try{
         if(err) throw err;
         db.query(query,(err,results)=>{
            if(err) throw err;
            
            const user_name = results[0].name
            req.session.user_name = user_name
            res.render(path.join(__dirname,'../view/dashboard.ejs'),{name:req.session.user_name,email:req.session.email,response:response})
         })
      }catch(err){
         res.redirect('/serverError')
      }
    
   })

   
   
  
})

route.get('/dashboard/update/:update_id',param_check('update_id'),get_update_id)

route.get('/logout',(req,res)=>{
   req.session.destroy()
   res.redirect('/')
})

route.get('/forgot_password',(req,res)=>{
   res.render(path.join(__dirname,'../view/forgot_password.ejs'))
})
route.get('/verifyUser',otp_auth,(req,res)=>{
   const otp_email = req.session.otp_email
   res.render(path.join(__dirname,'../view/otpGenerator.ejs'),{otp_email :otp_email})
})

route.get('/serverError',(req,res)=>{
   res.render(path.join(__dirname,'../view/error501Page.ejs'))
})
route.get('/refreshCaptcha',refreshCaptcha)

route.get('/setting',auth,(req,res)=>{
   
   
   res.render(path.join(__dirname,'../view/accountSetting.ejs'),{name:req.session.user_name,email:req.session.email})
    
})

route.get('/transaction_navbar',auth,(req,res)=>{
   res.render(path.join(__dirname,'../view/transaction_Navbar.ejs'),{name:req.session.user_name,email:req.session.email})
})
route.get('/create_password',(req,res)=>{
   
   

   let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
   

   try {
       const token = req.query.token
      const verified = jwt.verify(token, jwtSecretKey);
       console.log('veri',verified)
       if(verified){
            const email = verified.email
            const get_time = `SELECT * FROM token_expire WHERE Email = "${email}"`
            tokenTime.query(get_time,(err,result)=>{
               const time_now = Date.now()
               const result_time = verified.Exptime
               if(result_time < time_now || result.length === 0){

                 
                  res.render(path.join(__dirname,'../view/tokenExpire.ejs'))
               }else{
                   
                  res.render(path.join(__dirname,'../view/create_password.ejs'))
               }
            })

       }else{
           
            res.redirect('/serverError')
       }
   } catch (error) {
      
       res.redirect('*')
  
}
    
})

route.get('/get_user_details',auth,(req,res)=>{
   const {email} = req.session
   const query = `SELECT * FROM Users WHERE Email = "${email}"`
   db.query(query,(err,result)=>{
      console.log(result)
      if(err) throw err;
      res.json({
         status:200,
         data:{
            id:result[0].id,
            name:result[0].name,
            email:result[0].Email,
            Image:result[0].Image
         }
      })
   })
})


route.get('/setNewPassword',auth,(req,res)=>{
   res.render(path.join(__dirname,'../view/setNewPassword.ejs'))
})
route.get('*',(req,res)=>{
   res.render(path.join(__dirname,'../view/error.ejs'))
})
route.post('/change_password', changePassword)

route.post('/resend',resend_otp)

route.post('/otp_verification',otp_fun)

route.post('/forgot_password_check',forgot_password)

route.delete('/dashboard/delete/:delete_id',param_check('delete_id'),delete_fun)

route.put('/dashboard/update/success',updated_data)

route.post('/loginSubmit',validator(),login_fun)

route.post('/signupSubmit',signup_validator(),signup_fun)

route.post('/dashboard/create_emp',create_emp_fun)

route.post("/ImageUpload",ImageUpload)

route.post('/NewPasswordUpdate',NewPasswordUpdate)

route.put('/deleteAvatar',delete_Avatar)

route.put('/nameUpdate',nameUpdate)



module.exports = route