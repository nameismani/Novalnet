

const password = document.getElementById('password')

const email = document.getElementById('email')

const loginForm = document.getElementById('loginForm')

const show_success=document.getElementById('show_success')

const captcha_input=document.getElementById('captcha_input')

const captcha_change = document.getElementById('captcha_change')

const captcha_img_src = document.getElementById('captcha_img_src')

let email_err = document.getElementById('email_err')

let captcha_err = document.getElementById('captcha_err')

let pass_err = document.getElementById('error_show')

let password_error=true;

let email_check;

let captcha_check

// ------------------show password login--------------


$('#show_password').click((e)=>{

    if(password.type === 'password'){
        password.type = 'text'
        $('#eye_icon_login').html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
        <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
        <path d="M3 3l18 18"></path>
     </svg>`)
    }else{
        password.type = 'password'
        $('#eye_icon_login').html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>`)
    }
    
})


// -----------login form submit ----------

loginForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    
    if(isValid()){
        const data = {
            email : email.value.trim(),
            password : password.value.trim(),
            captcha:captcha_input.value,
    
        }
        console.log(data)
       
        fetch('http://localhost:8000/loginSubmit',{
            method:'POST',
            headers:{
                "Content-Type" : "application/json",
            },
            body:JSON.stringify(data)
    
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            if(data.status === 400){
                if(data.error === 'user'){
                    show_err(email_err,`* ${data.message}`,email)
                }
                else if (data.name === 'input'){
                    data.error.forEach((value)=>{
                        if(value.path==='email'){
                            show_err(email_err,`* ${value.msg}`,email)
                            
                            
                        }else{
                            show_err(pass_err,`* ${value.msg}`,password)
                            
                        }
                 })
                }else if(data.error === 'password'){
                    show_err(pass_err,`* ${data.message}`,password)
                }else if(data.error ==='captcha'){
                    console.log('hk')
                    show_err(captcha_err,`* ${data.message}`,captcha_input)
                }

            }
            else if (data.status === 200){  
                show_err(pass_err,'')
                window.location.href='/verifyUser'         
            }else if(data.status===501){
                window.location.href='/serverError'
            }else{
                $('#signinError').modal('show')

            }
        })
    }

})

// ------------------ show error --------------------------------

const show_err = (err,msg,add_class)=>{
    err.innerHTML=`${msg}`
    add_class?.classList.add('is-invalid')
}

// ---------------- remove class ----------------------------

const remove_class = (remove_class)=>{

    remove_class.classList.remove('is-invalid')
    remove_class.classList.add('is-valid')

}


// ------------------------ input password --------------------------

password.addEventListener('keyup',()=>{

    const specialCharacters = /[!@#$%^&*()_+{}|:<>?~-]/;
    if ( password.value.length < 8) {

        show_err(pass_err,'* Password minimum have 8 Letters',password)
        password_error=true
               
        
            }else  if ( password.value.search(/[a-z]/) < 0) {
                password_error=true
                show_err(pass_err,'* Atleast own lower case',password)
            }else  if ( password.value.search(/[A-Z]/) < 0) {
                password_error=true
                show_err(pass_err,'* Atleast own Upper case',password)
                
            }
            else if ( password.value.search(/[0-9]/) < 0) {
                password_error=true
                show_err(pass_err,'* Atleast own Integer',password)
               
            }else if(!specialCharacters.test(password.value)){
                password_error=true
                show_err(pass_err,"* Password must have a special characters",password)

            }
            else{
               pass_err.innerHTML=''
                password_error=false
                remove_class(password)
                
            }
    
})


// -------------------- email input validate ------------------


email.addEventListener('keyup',(e)=>{
    e.preventDefault()
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(!regex.test(email.value)){
        value=false;
        email_check=false
        show_err(email_err,"* Email is invalid",email)
        }else{
            email_check=true
            show_err(email_err,'')
            remove_class(email)
        }
})

// ------------------- captcha input ----------

captcha_input.addEventListener('keyup',(e)=>{
    
    if (captcha_input.value === ''){
       
       show_err(captcha_err,'* Captcha is required',captcha_input)
   }else{
   
       show_err(captcha_err,'')
       remove_class(captcha_input)
   }
})

// ----------------------------- isvalid function for submit -----------------------

function isValid(){
    let value = true;
    if(email.value === '' && password.value === ''  && captcha_input.value ==='' ){
        value=false; 
        show_err(email_err,'* Please fill the email input',email)
        show_err(pass_err,'* Please fill the password input',password)
        show_err(captcha_err,'* Captcha required',captcha_input)
    }else if(email.value === ''){
        value=false
            show_err(email_err,'* Please fill the email input',email)
    } else if(!email_check){
        value=false;
        show_err(email_err,'* Please check the email input',email)
    }
    else if(password.value === ''){
        value=false;
       show_err(pass_err,'* Please fill the password input',password)
    }else if(password_error){
        value=false;
    show_err(pass_err,"* Please check the passwore correctly",password)
    }
    else if (captcha_input.value ===''){
        value = false;
        show_err(captcha_err,"* Captcha is required",captcha_input)
    }
  
    return value

   
}

// ------------------captcha change function ------------------------

captcha_change.addEventListener('click',(e)=>{
    e.preventDefault()
    fetch('http://localhost:8000/refreshCaptcha',{
        method:"GET",
        headers:{
            "Content-Type" :"application/json"
        }
    }).then((res)=>res.json())
    .then((data)=>{
        captcha_img_src.src=`otp_img/${data.src}`
    })
})