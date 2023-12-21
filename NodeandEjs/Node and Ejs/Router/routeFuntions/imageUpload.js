const formidable = require('formidable')
const path = require('path')
const user_tb = require('../../Model/user_table')


const fs = require('fs')
const ImageUpload= (req,res)=>{
    const {email} = req.session
    try{
        let {file} = req.files
    
    
        const arr_name = file.name.split('.')
        const file_ex=arr_name[arr_name.length - 1]
        file.name = `${Date.now()}.${file_ex}`
        console.log(file.name)
        file.mv(path.join(__dirname , `../../public/uploads/${file.name}`))
        const get_old_image = `SELECT Image FROM Users WHERE Email="${email}"`
        user_tb.query(get_old_image,(err,result)=>{
            if(err) throw err;
            if(result[0].Image !== 'default_avatar.jpg'){
            fs.unlinkSync(path.join(__dirname,`../../public/uploads/${result[0].Image}`))
            }
        })
        const user_query = `UPDATE Users SET Image="${file.name}" WHERE Email = "${email}"`
        const query = user_tb.format(user_query,[file.name])
        user_tb.query(query,(err,result2)=>{
            if(err) throw err;
            console.log(result2)
            res.json({
                status :200,
                file:file.name
            })
        })
    }catch(err){
        res.json({
            status:400,
            message:"Selected any one image to submit"
        })
    }
  
  
}

module.exports = {ImageUpload}