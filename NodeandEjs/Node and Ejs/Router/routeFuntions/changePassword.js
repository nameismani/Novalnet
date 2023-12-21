const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db= require('../../Model/user_table')
const tokenTime = require('../../Model/tokenExpire')


const changePassword = (req,res)=>{
    const {password} = req.body
    console.log(password)
   
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
   let jwtSecretKey = process.env.JWT_SECRET_KEY;
 
   

   try {
       const token = req.header(tokenHeaderKey)
       console.log(token)
 
       const verified = jwt.verify(token, jwtSecretKey);
       
       if(verified){
        console.log('verified',verified)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)
          const update_password = `UPDATE Users SET Password ="${hash}" WHERE Email = "${verified.email}"`

                        db.query(update_password,(err,update_res)=>{
                            try{
                                if(err) throw err;
                                const del_time = `DELETE FROM token_expire WHERE Email = "${verified.email}"`
                                tokenTime.query(del_time,(err,res)=>{
                            try{
                                if(err) throw err;
                            }catch(err){
                        res.redirect('/serverError')
                            }
                        })
                                res.json({
                                    status:200,
                                    message:"Password Updated Successfully"
                                   })
                            }catch(err){
                                res.json({
                                    status:501,
                                    message:"Internal Server Error"
                                })
                            }
                           
                        })
        
       }else{
           // Access Denied
           return res.status(401).json({
            status:400,
            message:"Access Denied"
           });
       }
   } catch (error) {
       // Access Denied
       return res.status(401).json({
        status:400,
        message:"Access Denied"
       });
   }
}
module.exports = {changePassword}