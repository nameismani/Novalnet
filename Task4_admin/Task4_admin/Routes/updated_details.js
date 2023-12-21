const db = require('../database/database')

const single_id = (req,res)=>{

    const id = req.params.id

    const sql = `SELECT * FROM Employee_Details WHERE id = ${id} `

    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.json({
            status : 200,
            message:"Get details successfully",
            data:result[0]
        })
    })

}

module.exports = {single_id}