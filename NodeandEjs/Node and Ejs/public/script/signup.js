



const password = document.getElementById('password')

const email = document.getElementById('email')

const name_input = document.getElementById('name')

const cof_pass = document.getElementById('confirm_password')

const signupForm = document.getElementById('signupForm')

const name_err = document.getElementById('name_err')

const show_success=document.getElementById('show_success')

const checkbox = document.getElementsByName('checkbox')

const email_err = document.getElementById('email_err')

const pass_err = document.getElementById('error_show')

const confirm_err = document.getElementById('confirm_err')

let password_error=true;

let name_check ;

let email_check;

let conf_check;

// -------------------- show password icon click ----------

$('#show_password').click((e)=>{

    
    e.preventDefault()
    if(password.type === 'password'){
        password.type = 'text'
        $('#eye_icon_signup').html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
        <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
        <path d="M3 3l18 18"></path>
     </svg>`)
    }else{
        password.type = 'password';
        $('#eye_icon_signup').html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>`)
  
    }
    
})

// --------------- signup for submit --------------

signupForm.addEventListener('submit',(e)=>{
  console.log('sdf')
    e.preventDefault()
    
    if(isValid()){
        const data = {
            name:name_input.value.trim(),
            email : email.value.trim(),
            password : password.value.trim()

    
        }
        console.log(data)
       
        fetch('http://localhost:8000/signupSubmit',{
            method:'POST',
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify(data)
    
        })
        .then((res)=>res.json())
        .then((data)=>{
           console.log(data)
            if(data.status === 400){
                console.log(data)
                if(data.name === 'input'){
                    data.error.forEach((value)=>{
                        if(value.path ==='name'){
                            show_err(name_err,`* ${value.msg}`,name_input)
                        }if(value.path ==='email'){
                            show_err(email_err,`* ${value.msg}`,email)
                        }if(value.path === 'password'){
                            show_err(pass_err,`* ${value.msg}`,password)
                        }if(value.path ==='confirm_password'){
                            show_err(confirm_err,`* ${value.msg}`,cof_pass)
                        }
                    })
                }else if(data.error = 'email'){
                    show_err(email_err,`* ${data.message}`,email)

                }else{
                    show_err(confirm_err,`* ${data.message}`,email)
                }
            }else if(data.status === 200){
                $('#signupSuccess').modal('show')
                
                setTimeout(()=>{
                  
                    $('#signupSuccess').modal('hide')
                    window.location.href='/signin'
                },1000)
            }else if(data.status === 501){
                // window.location.href='/serverError'
            }else{
                $('#signupError').modal('show')
            }
        })
    }

})


// ----------------- show error function -----------


const show_err = (err,msg,add_class)=>{
    err.innerHTML=`${msg}`
    add_class?.classList.add('is-invalid')
}


// ------------------- keyup event for password ------------

password.addEventListener('keyup',()=>{
   
    const specialCharacters = /[!@#$%^&*()_+{}|:<>?~-]/;
    if ( password.value.length < 8) {//special character password validation?

        show_err(pass_err,'* Password minimum have 8 Letters',password)

               
        
            }else  if ( password.value.search(/[a-z]/) < 0) {
                show_err(pass_err,'* Atleast own lower case',password)
            }else  if ( password.value.search(/[A-Z]/) < 0) {
                show_err(pass_err,'* Atleast own Upper case')
                
            }
            else if ( password.value.search(/[0-9]/) < 0) {
                show_err(pass_err,'* Atleast own Integer',password)
               
            }else if(!specialCharacters.test(password.value)){
                show_err(pass_err,"* Password must have a special characters",password)

            }
            else{
               pass_err.innerHTML=''
               
                password_error=false
                remove_class(password)
    
                
            }
    
})

// --------------- keyup event for email --------------

email.addEventListener('keyup',()=>{
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

// ------------------------- keyup event for name input ------------

name_input.addEventListener('keyup',(e)=>{
    
     if (name_input.value.search(/[0-9]/) > 0 || name_input.value.search(/[0-9]/) === 0 ){
        name_check=false
        show_err(name_err,'Name field doesnot contain a number',name_input)
    }else{
        name_check=true
        show_err(name_err,'')
        remove_class(name_input)
    }
})

// ----------- keyup event for confirm password ------------

cof_pass.addEventListener('keyup',()=>{
    if(password.value === cof_pass.value){
        conf_check = true;
        show_err(confirm_err,"")
        remove_class(cof_pass)
    }
    else{
        conf_check = false;
        show_err(confirm_err,"* Password did not match",cof_pass)
    }
})

// ------------------- function for valid submit form --------------

function isValid(){
    let value = true;
    if(name_input.value === '' && email.value === '' && password.value ==='' && cof_pass.value === ''  ){
        value=false;
        show_err(name_err,"* Please fill the name input",name_input)
        show_err(email_err,'* Please fill the email input',email)
        show_err(pass_err,'* Please fill the password input',password)
        show_err(confirm_err,"* Please fill the confirm password input",cof_pass)
     
        
    }else if(!name_check){
        value=false;
        show_err(name_err,"Please check the name field ",name_input)
    }else if(!email_check){
        value=false;
            show_err(email_err,'* Please check the email input',email)
    }else if(password_error){
        value=false;
       
        show_err(pass_err,"* Please check the passwore correctly",password)
    }else if(password.value !== cof_pass.value){
        value=false
            show_err(confirm_err,"* Password did not match",cof_pass)
    }
    else if(!checkbox[0].checked){
            value=false
            show_err(confirm_err,"* Please agree the terms and conditions")
        }

    return value
}

// --------------- function for remove class ---------

const remove_class = (remove_class)=>{

    remove_class.classList.remove('is-invalid')
    remove_class.classList.add('is-valid')

}

// -------------------- terms and condition chekk -------------------

$("#checkbox").click(()=>{
  
   if(checkbox[0].checked){
    console.log('tru')
    show_err(confirm_err,"")
   }
})