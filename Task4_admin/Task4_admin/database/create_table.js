const db = require('./database')
const sql = `CREATE TABLE IF NOT EXISTS Users (id INT AUTO_INCREMENT PRIMARY KEY,users_role VARCHAR(50), First_Name VARCHAR(100), Last_Name VARCHAR(100), Email VARCHAR(50), Password VARCHAR(64), Confirm_Password VARCHAR(64) )`

db.query(sql,function(err,result){
    if(err) throw err;
    console.log('table created')

})

module.exports=db