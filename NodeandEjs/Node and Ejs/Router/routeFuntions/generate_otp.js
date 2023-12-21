  
    const generate_otp = ()=>{
        let digits = '01234567689'
        let otp=''
        for(let i=0;i<6;i++){
            otp += digits[Math.floor(Math.random() * 10)];
    
        }

    
        return otp
    }

    module.exports = {generate_otp}