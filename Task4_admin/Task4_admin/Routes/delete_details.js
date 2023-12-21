const db = require('../database/database')

const delete_details = (req,res)=>{

const delete_id = req.params.id

const delete_query = `DELETE FROM Employee_Details WHERE id = ${delete_id}`

db.query(delete_query,(err,result)=>{
if(err) throw err;
res.json({
    status : 200,
    message : 'Employee Details Deleted Successfully'
})
})


}

module.exports = {delete_details}