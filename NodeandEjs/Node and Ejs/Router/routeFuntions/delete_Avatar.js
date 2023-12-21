const user_table = require('../../Model/user_table')
const fs = require('fs')
const path = require('path')
const delete_Avatar = (req,res)=>{
    const {email} = req.session

    const Default_Image = `default_avatar.jpg`

    const get_old_image = `SELECT Image FROM Users WHERE Email="${email}"`
    user_table.query(get_old_image,(err,result)=>{
        if(err) throw err;
        if(result[0].Image !== 'default_avatar.jpg'){
            fs.unlinkSync(path.join(__dirname,`../../public/uploads/${result[0].Image}`))

        }
    })

    const delete_img = `UPDATE Users SET Image="${Default_Image}" WHERE Email ="${email}"`

    user_table.query(delete_img,(err,result)=>{
        if(err) throw err;
        res.json({
            status:200,
            message:"Avatar Delete Successfully",
            image:Default_Image
        })
    })


}

module.exports={delete_Avatar}