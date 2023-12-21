const fs = require('fs')
const path = require('path')
const delete_cap_img = ()=>{
    fs.readdirSync(path.join(__dirname,'../../public/otp_img')).forEach(file => {
        fs.unlinkSync(path.join(__dirname,`../../public/otp_img/${file}`))
      });
} 
module.exports ={ delete_cap_img}