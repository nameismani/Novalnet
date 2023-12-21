const { delete_cap_img } = require("./delete_captcha_image");
const Captcha = require('captcha-generator-alphanumeric').default
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const refreshCaptcha = (req,res)=>{

    delete_cap_img()
    let captcha = new Captcha();
    
    const salt = bcrypt.genSaltSync(10)
    const captcha_value = bcrypt.hashSync(captcha.value,salt)
    res.cookie('captcha',captcha_value)
    console.log(captcha.value)
    captcha.PNGStream.pipe(fs.createWriteStream(path.join(__dirname + '../../../public/otp_img', `${captcha.value}.png`)));
    

    res.json({
        status:200,
        src:`${captcha.value}.png`
    })
}

module.exports = {refreshCaptcha}