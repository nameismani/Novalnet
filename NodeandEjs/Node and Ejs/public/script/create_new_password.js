
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

 
const new_pass = document.getElementById('new_pass')
const new_conf_pass = document.getElementById('new_conf_pass')
let pass_err = document.getElementById('new_pass_err')
let conf_pass_err = document.getElementById('conf_pass_err')
let password_error=true;
let conf_check;

new_pass.addEventListener('keyup',()=>{

})
$('#show_new_password').click((e)=>{

   
    e.preventDefault()
    if(new_pass.type === 'password'){
        new_pass.type = 'text'
        $("#eye_icon_pass").html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
        <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
        <path d="M3 3l18 18"></path>
     </svg>`)
    }else{
        new_pass.type = 'password';
        $('#eye_icon_pass').html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>`)
  
    }
    
})

new_pass.addEventListener('keyup',()=>{

    const specialCharacters = /[!@#$%^&*()_+{}|:<>?~-]/;
    if ( new_pass.value.length < 8) {

        show_err(pass_err,'* Password minimum have 8 Letters',new_pass)

               
        
            }else  if ( new_pass.value.search(/[a-z]/) < 0) {
                show_err(pass_err,'* Atleast own lower case',new_pass)
            }else  if ( new_pass.value.search(/[A-Z]/) < 0) {
                show_err(pass_err,'* Atleast own Upper case',new_pass)
                
            }
            else if ( new_pass.value.search(/[0-9]/) < 0) {
                show_err(pass_err,'* Atleast own Integer',new_pass)
               
            }else if(!specialCharacters.test(new_pass.value)){
                show_err(pass_err,"* Password must have a special characters",new_pass)

            }
            else{
               pass_err.innerHTML=''
               
                password_error=false
                remove_class(new_pass)
                
            }
    
})

new_conf_pass.addEventListener("keyup",()=>{
    if(new_pass.value === new_conf_pass.value){
        conf_check=true
        show_err(conf_pass_err,'')
        remove_class(new_conf_pass)
    }else{
        conf_check=false
        show_err(conf_pass_err,"* Password did not match",new_conf_pass)
    }
})

const show_err = (err,msg,add_class)=>{
    err.innerHTML=`${msg}`
    add_class?.classList.add('is-invalid')
}
const remove_class = (remove_class)=>{

    remove_class.classList.remove('is-invalid')
    remove_class.classList.add('is-valid')

}
$('#create_new_password').submit((e)=>{
    e.preventDefault()
    if(isValid()){
        const data={
            password : new_pass.value
        }

        fetch('http://localhost:8000/change_password',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`${token}`
            },
            body:JSON.stringify(data)
            
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status === 200){
                $('#createPassSuccess').modal('show')
                setTimeout(()=>{
                    $("#createPassSuccess").modal('hide')
                    window.location.href='/'
                },1000)
            }else if(data.status === 400){
                $("#createPassError").modal('show')
                setTimeout(()=>{
                    $("#createPassSuccess").modal('hide')
                    
                },1000)
            }else if(data.status === 500){
                window.location.href='/serverError'
            }
        })
    }
    
})

function isValid(){
    let value = true;
    if(new_pass.value==="" && new_conf_pass.value === ''){
        value=false;
        show_err(pass_err,'* Please fill the password input',new_pass)
        show_err(conf_pass_err,'* Please fill the password input',new_conf_pass)
    }else if(new_pass.value === ''){
        value=false;
        show_err(pass_err,'* Please fill the password input',new_pass)
    }else if(new_conf_pass.value === ''){
        value=false;
        show_err(conf_pass_err,'* Please fill the password input',new_conf_pass)
    }else if(password_error){
        value=false;
        show_err(pass_err,'* Please check the password field ',new_pass)
    }else if(new_pass.value !== new_conf_pass.value ){
        value=false
        show_err(conf_pass_err,'* Password did not match',new_conf_pass)
    }else if(!conf_check){
        value=false
        show_err(conf_pass_err,'* Password did not match',new_conf_pass)
    }
    return value

}


