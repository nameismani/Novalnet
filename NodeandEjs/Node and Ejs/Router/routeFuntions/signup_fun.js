const db = require('../../Model/user_table')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
var session;
const signup_fun = (req,res)=>{
    const {name,email,password} = req.body
    const Default_Image = `default_avatar.jpg`
    const error_result = validationResult(req)

    if(!error_result.isEmpty()){
   
     res.json({
         status :400,
         name:'input',
         message:"Please check the input fields",
         error:error_result.errors,
     })
    }else{
        const sql_select = `SELECT * FROM Users WHERE Email = ?`
        const sql_select_format =  db.format(sql_select,[`${email}`])
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const sql = `INSERT INTO Users (name,Email,Password,Image) VALUES (?,?,?,?) `
        const usersql = db.format(sql, [`${name}`,`${email}`,`${hash}`,`${Default_Image}`])
        
    
        db.query(sql_select_format,(err,result)=>{
            try{
                if(err) {
                    throw err;
                }
               
                if(result.length === 0){
                    db.query(usersql,(err,result)=>{
                        try{
                           console.log(result)

                            if(err)throw err;
                            res.json({
                                status: 200,
                                message: "User successfully created"
                            })
                        }catch(err){
                            res.json({
                                status:501,
                                message:"Internal server error"
                            })
                        }
                        
                    })
                  
                }
                   
                else {
                     res.json({
                        status: 400,
                        error:'email',
                        message: "User Already Exists"
                    })
                }
                   
                }catch(err){
                    res.json({
                        status:501,
                        message:"Internal Server Error"
                    })
                }
            }
           )
        
    
        
    }

    

    
}

module.exports = {signup_fun}