const emp_tab = require('../../Model/emp_table')
const Emp_Details = require('../../Model/emp_details_tb')
const delete_fun = (req,res)=>{
    const id = req.params.delete_id
    
    const delete_data_emp = `DELETE  FROM Emp_Table WHERE id = ${id}`

    emp_tab.query(delete_data_emp,(err,result1)=>{
        try{
            if(err) throw err;
      
            const delete_emp_det = `DELETE  FROM Emp_Details WHERE id =${id}`
            Emp_Details.query(delete_emp_det,(err,result2)=>{
                try{
                    if(err) throw err;
                    res.json({
                        status:200,
                        message:"Employee details deleted successfully"
                    })
    
                }catch(err){
                    res.json({
                        status:500,
                        message:" Error in sql , Try again Later"
                    })
                }
                
                
            })
        }catch(err){
            res.json({
                status:500,
                message:"Error in server"
            })
        }
        
    })
    
}

module.exports = {delete_fun}