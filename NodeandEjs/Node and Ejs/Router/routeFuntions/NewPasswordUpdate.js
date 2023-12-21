const bcrypt = require('bcrypt')
const user_tb = require('../../Model/user_table')
const NewPasswordUpdate = (req,res)=>{
        const {old_password,new_password} = req.body
        const email = req.session.email
        console.log(email)
        const pass_query = `SELECT * FROM Users WHERE Email = "${email}" `
        user_tb.query(pass_query,(err,result)=>{
            const get_password = result[0].Password

            const compare_password = bcrypt.compareSync(old_password,get_password)
            if(compare_password){
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(new_password,salt)

                const update_password = `UPDATE Users SET Password="${hash}" WHERE Email ="${email}"`

                user_tb.query(update_password,(err,response)=>{
                    try{
                        if(err) throw err;
                        res.json({
                            status:200,
                            message:"Password Update Successfully"
                        })
                    }catch(err){

                        res.json({
                            status:501,
                            message:"Internal Server Error"
                        })

                    }
                })


            }else{
                res.json({
                    status:400,
                    message:"Password was Incorrect"
                })
            }
        })

        
}

module.exports={NewPasswordUpdate}
