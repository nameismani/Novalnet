const crypto = require('crypto');
const md5 = require('md5');
const fs=require('fs');
const path=require('path')

const passKey = 'a08edf38355622accee947cd282c67e8';
const keyHash = md5('a08edf38355622accee947cd282c67e8').substring(0, 16);

function opensslEncryption(rawPassword) {
	const cipher = crypto.createCipheriv('aes-256-cbc', passKey, keyHash);
	var encrypted = cipher.update(rawPassword, 'utf-8', 'base64');
	encrypted += cipher.final('base64');
	encrypted = Buffer.from(encrypted, 'utf-8').toString('base64');	
	return encrypted;
}

function opensslDecryption(encryptedPassword) {	
	const password = Buffer.from(encryptedPassword, 'base64').toString('utf-8');
	const decipher = crypto.createDecipheriv('aes-256-cbc', passKey, keyHash);
	var decrypted = decipher.update(password, 'base64', 'utf-8');
	decrypted += decipher.final('utf-8');	
	return decrypted;
}

function generateOtp(min, max) {  
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

function checkAvailability(arr, val) 
{
  return arr.some(arrVal => val === arrVal);
}

const processLangCode = () => {
    return (req, res, next) => { 
        if(!req.params.lang) {
            req.statusCode = 101;
            return next()
        }

        const available_lang = ["en", "de"]; // Current available language list
        if(checkAvailability(available_lang, req.params.lang)) {
            req.currentLang = req.params.lang;  
        }
        else {
            req.currentLang = 'en'; 
        } 
        req.statusCode = 100;
        return next()
    }
}

const dashboard_custom_active =()=>{
    let dashboards=JSON.parse(fs.readFileSync(path.join(__dirname, "../media/files/json/custom_dashboard.json")));
    let active_dashboard = dashboards.custom_dashboard.filter((value)=>{
        if(value.active == true){
          return value
        }
        
      })
  return active_dashboard;
}

const dashboard_custom =()=>{
    let dashboards=JSON.parse(fs.readFileSync(path.join(__dirname, "../media/files/json/custom_dashboard.json")));
    let active_dashboard=dashboards.custom_dashboard.filter((value)=>{
        if(value.active == true && value.default_dashboard == false){
          return value
        }
      }) 
       let default_dashboard = dashboards.custom_dashboard.filter((value)=>{
        if(value.default_dashboard == true && value.active ==  true){
          return value
         
        }
      })

  return {active_dashboard,default_dashboard};
}

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = {
  encryption: opensslEncryption,
  decryption: opensslDecryption,
  generateOtp: generateOtp,
  langCode: processLangCode,
  dashboards:dashboard_custom,
  active_dashboard:dashboard_custom_active,

}
