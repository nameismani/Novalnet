const mysql = require('mysql')

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"novalnet",
    database:'Ejs_users'
})

con.connect((err,res)=>{
    try{
        if(err) throw err;

    }
    catch(err){
        console.log(err)
    }
   
    
})

module.exports = con