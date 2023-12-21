

const otp_submit = document.getElementById('otp_submit')
const num1=document.getElementById('num1')
const num2=document.getElementById('num2')
const num3=document.getElementById('num3')
const num4=document.getElementById('num4')
const num5=document.getElementById('num5')
const num6=document.getElementById('num6')
const otp_err = document.getElementById('otp_err')
const all_input =document.querySelectorAll('input')

const get_email = document.getElementById('get_email')
const email_value = get_email.innerHTML.trim()
otp_submit.addEventListener('submit',(e)=>{
    e.preventDefault()
    const otp_value = `${num1.value}${num2.value}${num3.value}${num4.value}${num5.value}${num6.value}`
    const data = {
        otp:otp_value,
        email:email_value
    }
    console.log(data)
    if(isValid()){
       fetch('http://localhost:8000/otp_verification',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
       })
       .then((res)=>res.json())
       .then((data)=>{
        console.log(data)
        if(data.status === 400){
            otp_err.innerHTML=`* ${data.message}`
        }else if(data.status ===200){
            $('#verify_user').modal('show')
            setTimeout(()=>{
                window.location.href='/dashboard'
            },1000)
        }
       })
    }

})

function isValid(){
    let value = true;
    all_input.forEach((result)=>{
        if(result.value ===''){
            value = false
            otp_err.innerHTML=`* Please fill the all value`
        }
    })
    return value
}
const times = document.getElementById('times')

let resend_round =0
let balance_attempt = 4
console.log('round',resend_round)
const increment_round = (round)=>{
    return resend_round=round+1
}

const decrement_attempt = (attempt)=>{
    return balance_attempt=attempt-1
}
$(document).ready(()=>{
    
   
   
    
    

    function sendCode(countDownTarget){
 
        var x = setInterval(function() {
            showClock(countDownTarget);
            if (countDownTarget - new Date().getTime() < 0) {
                clearInterval(x);
                $('#times').hide()
                $('#resend_code').show()
            }
            
        }, 1000);
        function showClock(target) {
            const distance = target - new Date().getTime();
            const mins = distance < 0 ? 0: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secs = distance < 0 ? 0: Math.floor((distance % (1000 * 60)) / 1000);        
        
    
            document.getElementById("minutes").innerHTML = mins;
           document.getElementById("seconds").innerHTML = secs;
           
        }
    }

    sendCode( new Date().getTime() +  1000 * 90 )
       
    $('#resend_code').click(()=>{
        const data = {
            email:email_value
        }
        fetch('http://localhost:8000/resend',{
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify(data)
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status === 200){
                $('#Resend_success').modal('show')
                 increment_round(resend_round)
                 decrement_attempt(balance_attempt)
                setTimeout(()=>{
                    $('#Resend_success').modal('hide')
                },1000)
                if(resend_round< 4){
                    $('#times').show()
                    $('#resend_code').hide()
                    sendCode( new Date().getTime() +  1000 * 90 )
                    $('#limit').html(`You can still try ${balance_attempt} times to send otp`)

                }else{
                   
                    $('#remove_para').hide()
                    $('#limit').html("* You Reached your Maximum attempt")
                    $('#limit').css({"color":"red"})
                    
                }
              
               
            }
        })
    })
    
    
})

