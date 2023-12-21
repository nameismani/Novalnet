const db = require('../database/database')

const get_table_view =(req,res)=>{

    const select_table='SELECT * FROM Employee_Details'

    db.query(select_table,(err,result)=>{
        if(err) throw err;
        res.json({
            status:200,
            message:'Employee details get successfully',
            data:result
        })
    })

}

module.exports = {get_table_view}