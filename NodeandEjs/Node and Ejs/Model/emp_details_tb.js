

const db =require('./database')

const emp_tb=`CREATE TABLE IF NOT EXISTS Emp_Details (id INT,Doj VARCHAR(60),Dob VARCHAR(60),  Gender VARCHAR(60), Comment VARCHAR(150))`



db.query(emp_tb,(err,res)=>{
    try{
        if(err) throw err;

    }catch(err){
        console.log(err)
    }
 
    
})



module.exports = db