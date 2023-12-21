const user_table= require('../../Model/user_table')

const nameUpdate = (req,res)=>{
const email = req.session.email
    const {name} = req.body
    const name_query = `UPDATE Users SET name="${name}" WHERE Email="${email}"`

    user_table.query(name_query,(err,result)=>{
        try{
            if(err) throw err;
            res.json({
                status:200,
                message:"Name Change Successfully"
            })
        }catch(err){
            console.log(err)
            res.json({
                status:501,
                message:"Internal Server Error"
            })
        }
    })

    
}
module.exports = {nameUpdate}