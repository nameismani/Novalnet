const { generate_otp } = require("./generate_otp")
const otp_tb = require('../../Model/otpTable')
const nodemailer = require('nodemailer')
const {transporter}=require('./mailTransport')
var session

const resend_otp = (req,res)=>{
  
    const {email} = req.body
    const gen_otp = generate_otp() 


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
                html: `<p>Your Otp for registration is <b>${gen_otp}.</b> Use this password to validate login</p>`
            }
               transporter.sendMail(send_mail,(err,mail_res)=>{
                if(err) throw err;
               
                res.json({
                    status: 200,
                    message: "OTP succssfully Resend"
                    })
               });
                
            
           
            
   
   
   
        }catch(err){
            console.log(err)
           
        } 
    })
}

module.exports= { resend_otp}