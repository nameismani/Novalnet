const db =require('./database')

const emp_tb=`CREATE TABLE IF NOT EXISTS Auth_verify (id INT AUTO_INCREMENT PRIMARY KEY,Email VARCHAR(100),otp VARCHAR(50))`



db.query(emp_tb,(err,res)=>{
    try{
        if(err) throw err;

    }catch(err){
        console.log(err)
    }
    
})



module.exports = db