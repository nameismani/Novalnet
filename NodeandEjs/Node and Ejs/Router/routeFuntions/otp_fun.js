const otp_tb = require('../../Model/otpTable')
var session ;

const otp_fun =(req,res)=>{
    const {email,otp} = req.body;

    const get_email_db = `SELECT * FROM Auth_verify WHERE Email = "${email}"`

    otp_tb.query(get_email_db,(err,otp_res)=>{
        if(err)throw err;
        const arr_res = otp_res
        const get_otp = arr_res[arr_res.length - 1].otp
        console.log(get_otp)
        if(get_otp === otp){
            const delete_otp = `DELETE FROM Auth_verify WHERE Email ="${email}" `
            otp_tb.query(delete_otp,(err,res)=>{
                if(err) throw err;
               
            })
            session=req.session
            session.email=email
           res.json({
            status:200,
            message:"verified successfully"
           })
        }else{
            res.json({
                status:400,
                message:"otp password mismatch"
            })
        }

    })
    
}


module.exports = {otp_fun}