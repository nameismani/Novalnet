const emp_tab = require('../../Model/emp_table')
const Emp_Details = require('../../Model/emp_details_tb');
const { validationResult } = require('express-validator');

const get_update_id = (req,res)=>{
    const error_result = validationResult(req)
    if(!error_result.isEmpty()){
        res.json({
            status:400,
            error:"params",
            message:"Params not valid"
        })
    }else{
        const id = req.params.update_id;

        const update_query = `SELECT emp.id,emp.Emp_name, emp.Email, emp.Designation,emp_det.Doj , emp_det.Dob , emp_det.Gender , emp_det.Comment FROM Emp_Table AS emp JOIN Emp_Details AS emp_det ON emp.id=emp_det.id WHERE emp.id = ${id} `
    
        emp_tab.query(update_query,(err,result)=>{
            try{
                if(err) throw err;
                res.json({
                    status:200,
                    message:"Details get successfully ",
                    data:result
                })
            }catch(err){
                res.json({
                    status:501,
                    message:"Internal server error"
                })
            }
            
        })
    }
    
}

module.exports = {get_update_id}