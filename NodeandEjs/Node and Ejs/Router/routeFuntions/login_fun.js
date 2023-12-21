const {validationResult}=require('express-validator')
const db= require('../../Model/user_table')
const bcrypt = require('bcrypt')
const otp_tb = require('../../Model/otpTable')
const path = require('path')
const nodemailer = require('nodemailer')
const {transporter} = require('./mailTransport')
const { generate_otp } = require('./generate_otp')


var session

const login_fun = (req,res)=>{

   
    


   const {email,password,captcha} = req.body



   const error_result = validationResult(req)

   if(!error_result.isEmpty()){
   
    res.json({
        status :400,
        name:'input',
        message:"Please check the input fields",
        error:error_result.errors,
    })
   }else{
    const cookie_captcha = req.cookies.captcha
    const get_captcha = bcrypt.compareSync(captcha,cookie_captcha)



    if(!get_captcha){
        res.json({
            status:400,
            error:'captcha',
            message:"Incorrect Captcha"
        })
    }else{
        const sql_select = `SELECT * FROM Users WHERE Email = ?`
        const sql_select_format =  db.format(sql_select,[`${email}`])
        db.query(sql_select_format,(err,result)=>{
            try{
                if(err){
                    throw err;
                }
                
                if(result.length === 1){
              
                const get_password = result[0].Password
                
                const compare_password = bcrypt.compareSync(password,get_password)
                    if(compare_password){
                        const gen_otp = generate_otp()
                        console.log('otp',gen_otp)
                       const otp_query = `INSERT INTO Auth_verify (Email,otp) VALUES ("${email}","${gen_otp}")`
                       otp_tb.query(otp_query,(err,otp_res)=>{
                           try{
                               if(err) throw err;
                               session= req.session
                               session.otp_email = email
                           
                               const send_mail= {
                                   from: ``, 
                    
                                   to: `${email}`,
                                   subject:"One Time Password Generate", 
                                   html: `<h1>Verify your email address</h1>
                                   <p>To finish setting up your  account, we just need to make sure this email address is yours.</p>
                                   <p>To verify your email address use this security code:<b> ${gen_otp}</b></p>
                                  <p> Thanks,</p>
                                  <p> Team </p>.
                                   `
                               }
                                  transporter.sendMail(send_mail,(err,mail_res)=>{
                                    try{
                                        if(err) throw err;
                                    }catch(err){
                                        res.json({
                                            status :501,
                                            message:"Internal server Error"
                                        })
                                    }
                                  
                                    
                                  });
                                 
                               
                      
                      
                      
                           }catch(err){
                               console.log(err)
                              
                           }  res.json({
                               status: 200,
                               message: "user login successfully"
                               })
                       })
                      
                        
         
                    }else{
                        
                            res.json({
                                status: 400,
                                error:'password',
                                message: 'Password was incorrected'
                            })
                    
                        
                    }
         
                }else{
                    res.json({
                        status: 400,
                        error:'user',
                        message: "User not found !"
                    })
         
                }
                
            }catch(err){
                res.json({
                    status:501,
                    error:'server',
                    message:"Internal server error"
                })
            }
               
           })
    }
   
 
   
 

   }
   

  
}

module.exports = {login_fun}