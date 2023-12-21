const db =require('./database')

const emp_tb=`CREATE TABLE IF NOT EXISTS token_expire (id INT AUTO_INCREMENT PRIMARY KEY,Email VARCHAR(100),time VARCHAR(50))`



db.query(emp_tb,(err,res)=>{
    try{
        if(err) throw err;

    }catch(err){
        console.log(err)
    }
    
})



module.exports = db