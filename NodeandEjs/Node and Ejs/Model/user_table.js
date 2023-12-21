const db= require("./database")

const user_tb_creat = `CREATE TABLE IF NOT EXISTS Users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), Email VARCHAR(50), Password VARCHAR(64), Image VARCHAR(100))`

const user_tb= db.query(user_tb_creat,(err,res)=>{
    try{
        if(err) throw err;

    }catch(err){
        console.log(err)
    }
})

module.exports=db