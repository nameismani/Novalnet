const db=require('../database/create_table')
const bcrypt = require('bcrypt')


var session;


const login_fun = (req, res) => {

    
    const user = req.body

    const sql_select = `SELECT * FROM Users WHERE Email = ?`
    const sql_select_format =  db.format(sql_select,[`${user.email}`])

    db.query(sql_select_format,(err,result)=>{
        if(err){
            throw err;
        }
        if(result.length === 1){
       
        const get_password = result[0].Password
        const user_role = result[0].users_role
        
        const compare_password = bcrypt.compareSync(user.password,get_password)
            if(compare_password){
                session = req.session
                session.user = user_role
              
              
                res.json({
                status: 200,
                message: "user login successfully"
                })

            }else{
                
                    res.json({
                        status: 401,
                        message: 'Password was incorrected'
                    })
            
                
            }

        }else{
            res.json({
                status: 400,
                message: "User not found !"
            })

        }
        
    })
   
}

module.exports= {login_fun}