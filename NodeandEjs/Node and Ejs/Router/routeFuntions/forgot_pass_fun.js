const db= require('../../Model/user_table')
const { transporter } = require('./mailTransport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const tokenTime = require('../../Model/tokenExpire')
var session
const forgot_password = (req,res)=>{


  
    const {forgot_email} = req.body
    const sql_select = `SELECT * FROM Users WHERE Email = ?`
        const sql_select_format =  db.format(sql_select,[`${forgot_email}`])
        db.query(sql_select_format,(err,result)=>{
            try{
                if(err){
                    throw err;
                }else{
                    
                   
                    if(result.length === 1){
                        // const new_password = generatePassword()
                        // console.log('new',new_password)
                        let jwtSecretKey = process.env.JWT_SECRET_KEY;
                        let jwtHeaderKey = process.env.TOKEN_HEADER_KEY;
                        let data = {
                            Exptime: (Date.now()) +(10 * 60 * 1000) ,
                            email:forgot_email
                        }
                      
                        const token = jwt.sign(data, jwtSecretKey);
                        res.header(jwtHeaderKey,token)
                       const link = `http://localhost:8000/create_password?token=${token}`//how to get token in frontend?
                        const sendmail =  {
                            from: ``, 
                            to: `${forgot_email}`,
                            subject:"New Password", 
                            html: `<p>Hi, Please visit the link <a href="${link}">Click to</a> to change the password . <p>The link will be expired in 10 minutes.</p> </p>`
                        }
                    // const salt = bcrypt.genSaltSync(10)
                    // const hash_new_password = bcrypt.hashSync(new_password,salt)

                    transporter.sendMail(sendmail,(err,mail_res)=>{
                        if(err) throw err;
                        const seconds = (new Date())
           
                      
                        const time_query = `INSERT INTO token_expire (Email,time) VALUES (?,?)`
                        const query = tokenTime.format(time_query,[forgot_email,seconds])
                        tokenTime.query(query,(err,res)=>{
                            if(err) throw err;
                          
                          
                        })
                        res.json({
                            status:200,
                            message:"New password link was send successfully"
                        })

                        
                        // const update_password = `UPDATE Users SET Password ="${hash_new_password}" WHERE Email = "${forgot_email}"`

                        // db.query(update_password,(err,update_res)=>{
                        //     if(err) throw err;
                        //     console.log(update_res)
                        // })

                      
                    })

                        

                    }else{
                        res.status(400).json({
                            status :400,
                            message:'User not Found'
                        }
                        )
                    }
                }
            }catch(err){
                console.log(err)
            }
        })
}

// const generatePassword = (() => {
//     const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
//     const passwordLength = 12;
  
//     return () => {
//       let password = '';
//       let hasInteger = false; // Flag to track if an integer is included
  
//       // Ensure at least one integer is included
//       const randomIndex = Math.floor(Math.random() * 10); // First character is an integer
//       password += charset.charAt(randomIndex);
//       hasInteger = true;
  
//       for (let i = 1; i < passwordLength; i++) {
//         const randomIndex = Math.floor(Math.random() * charset.length);
//         password += charset.charAt(randomIndex);
//       }
  
//       // If there's no integer yet, replace a random character with an integer
//       if (!hasInteger) {
//         const randomIndex = Math.floor(Math.random() * passwordLength);
//         const integerIndex = Math.floor(Math.random() * 10); // Random integer
//         password = password.substr(0, randomIndex) + charset.charAt(integerIndex) + password.substr(randomIndex + 1);
//       }
  
//       return password;
//     };
//   })();
  

module.exports = {forgot_password}