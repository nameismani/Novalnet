const db=require('../database/database')

const update_success = (req,res)=>{
    const id= req.params.id
    console.log(id)
 const {name,dob,doj,gender,designation,comments} = req.body

const query = `UPDATE Employee_Details SET name = "${name}", dob="${dob}", joiningDate = "${doj}", gender = "${gender}", designation = "${designation}" , comment = "${comments}" WHERE id=${id} `
console.log(query)
db.query(query,(err,result)=>{
    if(err)throw err;
    res.json({
        status:200,
        message:"details updated successfully"
    })
})

}

module.exports = {update_success}