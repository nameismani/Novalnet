const fs = require('fs')
const Captcha = require('captcha-generator-alphanumeric').default
const path = require('path')
const bcrypt = require('bcrypt')
const { delete_cap_img } = require('./delete_captcha_image')
const get_signup=(req,res)=>{
    delete_cap_img()
    let captcha = new Captcha();

    const salt = bcrypt.genSaltSync(10)
    const captcha_value = bcrypt.hashSync(captcha.value,salt)
    res.cookie('captcha',captcha_value)
   
    captcha.PNGStream.pipe(fs.createWriteStream(path.join(__dirname + '../../../public/otp_img', `${captcha.value}.png`)));
    console.log(captcha.value)
    res.render(path.join(__dirname,'../../view/signin.ejs'),{src:`${captcha.value}.png`})
}

module.exports={get_signup}