const forgot_email=document.getElementById('forgot_email')

const forgot_password_form = document.getElementById('forgot_password_form')

const email_err=document.getElementById('for_ema_err')

let email_check;

forgot_password_form.addEventListener('submit',(e)=>{
    e.preventDefault()
   
    if(isValid()){
        const data = {
            forgot_email:forgot_email.value
        }

        fetch('http://localhost:8000/forgot_password_check',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
                },
            body:JSON.stringify(data)
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status === 400){
                show_err(email_err,`* ${data.message}`,forgot_email)  

            }else if (data.status ===200){
                $('#newPasswordSend').modal('show')
                setTimeout(()=>{
                    $('#newPasswordSend').modal('hide')
                    window.location.href='/signin'
                },1000)
            }
        })
    }
})

// ------------------ validation for email in regex ---------

forgot_email.addEventListener('keyup',()=>{
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(!regex.test(forgot_email.value)){
        email_check=false
        show_err(email_err,"* Email is invalid",forgot_email)
        }else if(forgot_email.value===''){
            email_check=false
            show_err(email_err,"* Email is required",forgot_email)
        }else{
            email_check=true
            show_err(email_err,'')
            remove_class(forgot_email)
        }
})

// --------------------- function valid for email submit -------

function isValid(){
    let value = true;
    if(!email_check){
        value=false
        show_err(email_err,"* Please check the email field",forgot_email)
    }
    return value
    
}

// ----------------- show error function ---------------

const show_err = (err,msg,add_class)=>{
    err.innerHTML=`${msg}`
    add_class?.classList.add('is-invalid')
}

// --------------remove class function -------------

const remove_class = (remove_class)=>{

    remove_class.classList.remove('is-invalid')
    remove_class.classList.add('is-valid')

}