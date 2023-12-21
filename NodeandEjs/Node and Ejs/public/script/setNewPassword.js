
const old_pass = document.getElementById('old_pass')


const new_pass = document.getElementById('new_pass')


const new_conf_pass = document.getElementById('new_conf_pass')

const old_pass_err = document.getElementById('old_pass_err')

const new_pass_err = document.getElementById('new_pass_err')

const conf_pass_err = document.getElementById('conf_pass_err')

let new_password_error=true;

let old_password_error = true

const removes = (remove_invalid)=>{
    remove_invalid.classList.remove('is-invalid')
    remove_invalid.classList.remove('is-valid')
}

const cancel_input = ()=>{
    new_pass.value='';
    old_pass.value='';
    new_conf_pass.value=''
    show_err(new_pass_err,"")
    show_err(conf_pass_err,"")
    show_err(old_pass_err,"")
    removes(new_pass)
    removes(old_pass)
    removes(new_conf_pass)
   
}
$('#cancelSetPassword').click(()=>{
    cancel_input()

    
})
$("#cancelSetPasswordIcon").click(()=>{
    cancel_input()
    $('#NewPasswordModalOpen').modal('hide')
})
$('#NewPasswordModal').click((e)=>{
    e.preventDefault()
    $("#NewPasswordModalOpen").modal('show')
})


$("#set_new_password").submit((e)=>{
    e.preventDefault()
    if(isValid()){
        const data = {
            old_password : old_pass.value.trim(),
            new_password:new_pass.value.trim()
        }
        console.log(data)
        fetch(`http://localhost:8000/NewPasswordUpdate`,{
            method:"POST",
            headers:{
                "Content-Type" :"application/json"
            },
            body:JSON.stringify(data)
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status === 200){
                $('#newPasswordSuccess').modal('show')
                setTimeout(()=>{
                    $('#newPasswordError').modal('hide')
                    window.location.href = '/setting'
                },1000)   
            }else if(data.status === 400){
                show_err(old_pass_err,`* ${data.message}`,old_pass)
                $('#newPasswordError').modal('show')
                setTimeout(()=>{
                    $('#newPasswordError').modal('hide')
                    
                },1000)  
            }else if(data.status===501){
                window.location.href='/serverError'
            }
        })
    }
    
})

function typeChange(pass_input,pass_id){
    if(pass_input.type === 'password'){
        pass_input.type = 'text'
        $(`#${pass_id}`).html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
        <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
        <path d="M3 3l18 18"></path>
     </svg>`)
    }else{
        pass_input.type = 'password'
        $(`#${pass_id}`).html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>`)
    }
}



$('#show_old_password').click((e)=>{

   
    e.preventDefault()
    typeChange(old_pass,'svg_hide_1')
    
})
$('#show_new_password').click((e)=>{

   
    e.preventDefault()
    typeChange(new_pass,'svg_hide_2')
    
})




function isValid(){
    console.log(new_password_error)
    let value = true;
    if(old_pass.value === '' && new_pass.value === '' && new_conf_pass.value==='' ){
        value=false
        show_err(old_pass_err,"* Please fill the old password input",old_pass )
        show_err(new_pass_err,"* Please fill the old password input",new_pass )
        show_err(conf_pass_err,"* Please fill the old password input",new_conf_pass )
    }else if(old_pass.value===''){
        value=false;
        show_err(old_pass_err,"* Please fill the old password input",old_pass )
    }else if(new_pass.value ===''){
        value=false;
        show_err(new_pass_err,"* Please fill the old password input",new_pass )
    }else if(new_conf_pass.value === ''){
        value=false;
        show_err(conf_pass_err,"* Please fill the old password input",new_conf_pass )
    }else if(old_password_error){
    
        value=false;
        show_err(old_pass_err,"* Please check the password field",old_pass )
    }
    else if(new_password_error){
    
        value=false;
        show_err(new_pass_err,"* Please check the password field",new_pass )
    }else if(new_pass.value !== new_conf_pass.value){
        value=false;
        show_err(conf_pass_err,"* Password did not match",new_conf_pass )
    }else if(new_pass.value === new_conf_pass.value){
       
        show_err(conf_pass_err,"" )
        remove_class(new_conf_pass)
    }
    return value
}

const show_err = (err,msg,add_class)=>{
    err.innerHTML=`${msg}`
    add_class?.classList.add('is-invalid')
}
const remove_class = (remove_class)=>{

    remove_class.classList.remove('is-invalid')
    remove_class.classList.add('is-valid')

}




function passwordCheck (pass_input,err_pass,check_err){
    const specialCharacters = /[!@#$%^&*()_+{}|:<>?~-]/;
                if ( pass_input.value.length < 8) {

                    show_err(err_pass,'* Password minimum have 8 Letters',pass_input)

               
        
            }else  if ( pass_input.value.search(/[a-z]/) < 0) {
                show_err(err_pass,'* Atleast own lower case',pass_input)
            }else  if ( pass_input.value.search(/[A-Z]/) < 0) {
                show_err(err_pass,'* Atleast own Upper case',pass_input)
                
            }
            else if ( pass_input.value.search(/[0-9]/) < 0) {
                show_err(err_pass,'* Atleast own Integer',pass_input)
               
            }else if(!specialCharacters.test(pass_input.value)){
                show_err(err_pass,"* Password must have a special characters",pass_input)

            }
            else{
               err_pass.innerHTML=''
               if(check_err==='new_password_error'){
                new_password_error=false
               }else{
                old_password_error=false
               }
               
                
                remove_class(pass_input)
                
            }
    
}

new_pass.addEventListener('keyup',()=>{
 
    passwordCheck(new_pass,new_pass_err,"new_password_error")
   
    
})

old_pass.addEventListener('keyup',()=>{
 
    passwordCheck(old_pass,old_pass_err,"old_password_error")
   
    
})

new_conf_pass.addEventListener('keyup',()=>{
    if(new_pass.value !== new_conf_pass.value){
        show_err(conf_pass_err,"* Password did not match",new_conf_pass )
    }else{
        show_err(conf_pass_err,"" )
        remove_class(new_conf_pass)
    }
})

