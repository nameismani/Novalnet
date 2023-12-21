const db = require('../database/database')
const {employee_tab} = require('../database/employee_table')


const get_detail_employee =(req,res)=>{

  

    console.log(req.body)
    const{name , dob , doj , gender , designation , comments} = req.body
    
    const sql = `INSERT INTO Employee_Details (name,dob,joiningDate,gender,designation,comment) VALUES (?,?,?,?,?,?)`
    const format_sql  = db.format(sql,
        [`${name}`,`${dob}`,`${doj}`,`${gender}`,`${designation}`,`${comments}`]
        )

        db.query(format_sql,(err,result)=>{
            if(err) throw err;
             res.json({
                status:200,
                message:'Form Submitted Successfully'
            })
        })

}

module.exports={get_detail_employee}