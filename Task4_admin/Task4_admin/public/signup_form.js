// -------------------------- Signup form submit -------------------------------

// -------------------------- variable declaration ---------------------------



const signup_submit = document.getElementById('signup_form')

const user_password = document.getElementById('password')

const user_email=document.getElementById('email')

const first_name=document.getElementById('first_name')

const last_name=document.getElementById('last_name') 

const confirm_password=document.getElementById('confirm_password')

const getPara = document.getElementById('para')

const button = document.getElementById('btn')

const radio = document.getElementsByName('portal')



let password_check = true

let confirm_password_check = true

let eye_image=false
// ------------------------- Show Password ---------------------


const show_password=document.getElementById('showPassword')

show_password.addEventListener('click',()=>{
    let image = document.getElementById('image')
    if (user_password.type === 'password') {
          user_password.type = 'text'
          eye_image=true
          image.src='./openeye.jpg'
      } else {
          user_password.type = 'password'
          eye_image=false
          image.src='./closeeye.jpg';
      }
  
})
   
const checkRadio = ()=>{
    for (let i = 0 ; i < radio.length ; i++){
        if(radio[i].checked){
            radio.value = radio[i].value 
            return true
        }
    }
    return false
}

// ------------------signup form submit ----------------

signup_submit.addEventListener('submit',(e)=>{
    e.preventDefault()
   
   
   
  

    if(isValid()){
        const data={
            users:radio.value,
            first_name:first_name.value,
            last_name:last_name.value,
            email:user_email.value,
            password:user_password.value,
            confirm_password:confirm_password.value
        
        }
    
        

        fetch('http://localhost:8080/dashboard',{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(data)
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status === 400){
                show_error(getPara,data.message)
            }
            else if(data.status === 200){
                window.location.href='/dash'
            }
        })
        .catch((err)=>console.log(err))
       
    }

})

// -------------------------------------- function for check conditions ------------------



function isValid(){
    let valid = true
     if(confirm_password.value !== user_password.value){
        valid=false
        show_error(getPara,'Password did not match')
    }
    if(confirm_password_check){ 
        valid=false
        show_error(getPara,'Please check the confirm  Password')
    }
    if(password_check){ 
        valid=false
        show_error(getPara,'Please check the  Password')
    }
    if(confirm_password.value===''){
        valid=false
        show_error(getPara,'Please fill the Confirm Password')
    }
    if (user_password.value === '') {
        valid=false
        show_error(getPara, 'Please fill the Password')

    }
    if (user_email.value === '') {
        valid=false
        show_error(getPara, 'Please fill the email')

    }
    if (last_name.value.search(/[0-9]/) > 0 || last_name.value.search(/[0-9]/) === 0 ) {
        valid=false
        show_error(getPara, 'Name field did not contain a number')
    }
    if (last_name.value === '') {
        valid=false
        show_error(getPara, 'Please fill the Last Name')
    }
    if (first_name.value === '') {
        valid=false
        show_error(getPara, 'Please fill the First Name')
    } 
    if(!checkRadio()){
        valid = false;
        show_error(getPara,"Please choose user or admin")
    }
    
    return valid
    

}




// --------------------Show Error Function --------------------->

const show_error=(getPara,message)=>{
    getPara.innerHTML=`* ${message}`
}


// -------------------------- add class -------------------

getPara?.classList.add('input_errors')



// --------------------------password input keyup event ----------------------






user_password.addEventListener('keyup',()=>{


     if ( user_password.value.length < 8) {

        show_error(getPara,'Password minimum have 8 Letters')

       
            } else if ( user_password.value.search(/[a-z]/) < 0) {
                show_error(getPara,'Atleast own lower case')
            } else if ( user_password.value.search(/[A-Z]/) < 0) {
                show_error(getPara,'Atleast own Upper case')
                
            }
            else if ( user_password.value.search(/[0-9]/) < 0) {
                show_error(getPara,'Atleast own Integer')
               
            }else{
               getPara.innerHTML=''
               password_check=false
    
                
            }
    
})


// ----------------------- confirm_password keyup event ----------------------

confirm_password.addEventListener('keyup',()=>{
    if(confirm_password.value !== user_password.value){
        show_error(getPara,'Password did not match')
    }else{
       getPara.innerHTML=''
     confirm_password_check=false
       

    }
})


// ------------------------ image change focus event ---------------------------



user_password.addEventListener('focus',()=>{
    console.log(eye_image)
    if(!eye_image){
        let image=document.getElementById('image')

        image.src='./closeeye.jpg';
    
    }else{
        image.src='./openeye.jpg';
    }
   
})
user_password.addEventListener('focusout',()=>{
    let image=document.getElementById('image')
    
    image.src='./panda.png';
})
