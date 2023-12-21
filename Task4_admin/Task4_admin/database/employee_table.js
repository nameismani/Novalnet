const employee_tab = require('./database')
const sql = `CREATE TABLE IF NOT EXISTS Employee_Details (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), dob DATE, joiningDate DATE , gender VARCHAR(20), designation VARCHAR(64), comment VARCHAR(100) )`

employee_tab.query(sql,function(err,result){
    if(err) throw err;
    console.log('table created')

})

module.exports={employee_tab}