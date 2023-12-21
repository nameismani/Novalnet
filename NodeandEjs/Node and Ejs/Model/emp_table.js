const db =require('./database')

const emp_tb=`CREATE TABLE IF NOT EXISTS Emp_Table (id INT AUTO_INCREMENT PRIMARY KEY,Emp_name VARCHAR(100),Email VARCHAR(100), Designation VARCHAR(50))`



db.query(emp_tb,(err,res)=>{
    try{
        if(err) throw err;

    }catch(err){
        console.log(err)
    }
 
})



module.exports = db