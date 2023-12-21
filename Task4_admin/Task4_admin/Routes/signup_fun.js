const db=require('../database/create_table')
const bcrypt = require('bcrypt')


var session;

const signup_fun = (req, res) => {
   
    const user = req.body

    const sql_select = `SELECT * FROM Users WHERE Email = ?`
    const sql_select_format =  db.format(sql_select,[`${user.email}`])
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    const c_pas_hash = bcrypt.hashSync(user.confirm_password,salt)
    const sql = `INSERT INTO Users (users_role,First_Name,Last_name,Email,Password,Confirm_Password) VALUES (?,?,?,?,?,?) `
    const usersql = db.format(sql, [`${user.users}`,`${user.first_name}`,`${user.last_name}`,`${user.email}`,`${hash}`,`${c_pas_hash}`])
    

    db.query(sql_select_format,(err,result)=>{
        if(err) {
            throw err;
        }
        
        if(result.length === 0){
            db.query(usersql,(err,result)=>{
                
                if(err)throw err;
                
                
            })
          
            session = req.session
            session.user = user.users
            
             res.json({
                status: 200,
                message: "User successfully created"
            })
           }else {
             res.json({
                status: 400,
                message: "User Already Exists"
            })
        }
           
        })
    

}

module.exports = {signup_fun}