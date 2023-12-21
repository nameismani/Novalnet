const emp_tab = require('../../Model/emp_table')
const Emp_Details = require('../../Model/emp_details_tb')

const updated_data = (req,res)=>{
    const {id,name,email,dob,gender,doj,designation,comment} = req.body

    const updated_query = `UPDATE Emp_Table SET Emp_name = "${name}", Email = "${email}", Designation="${designation}" WHERE id = ${id}`

    emp_tab.query(updated_query,(err,result1)=>{
        try{
            if (err) throw err;
            const updated_second = `UPDATE Emp_Details SET Doj="${doj}", Dob="${dob}",Gender = "${gender}",Comment="${comment}"`
            Emp_Details.query(updated_second,(err,result2)=>{
                try{
                    if(err) throw err;
                    res.json({
                        status : 200,
                        message:"Details Updated Successfully",
                    })
                }catch(err){
                    res.json({
                        status:501,
                        message:"Internal server Error"
                    })
                }
                
            })
        }catch(err){
            res.json({
                status:501,
                message:"Internal server error"
            })
        }
      
    
    })
}

module.exports={updated_data}