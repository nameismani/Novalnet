
// // -----------------------Login Page Functions ------------------------

// -------------------------assign variables ------------------------

const login_submit =  document.getElementById('login_form')

const email_input = document.getElementById('email')

const password_inputs = document.getElementById('password')

const button = document.getElementById('btn')

const show_password=document.getElementById('showPassword')

const image=document.getElementById('image')

const getPara = document.getElementById('para')


let password_error = true;

let eye_image=false



// ------------------------function for show error ---------------------



const show_error=(getPara,message)=>{
    getPara.innerHTML=`* ${message}`
}

// --------------------- add classlist ------------------


getPara?.classList.add('input_errors')

// --------------------------password input keyup event -----------------------


password_inputs?.addEventListener('keyup',()=>{


    if ( password_inputs.value.length < 8) {

        show_error(getPara,'Password minimum have 8 Letters')

               
        
            } else if ( password_inputs.value.search(/[a-z]/) < 0) {
                show_error(getPara,'Atleast own lower case')
            } else if ( password_inputs.value.search(/[A-Z]/) < 0) {
                show_error(getPara,'Atleast own Upper case')
                
            }
            else if ( password_inputs.value.search(/[0-9]/) < 0) {
                show_error(getPara,'Atleast own Integer')
               
            }else{
               getPara.innerHTML=''
               
                password_error=false
    
                
            }
    
})

// ------------------------- Show Password click event---------------------



show_password.addEventListener('click',()=>{
    
    if (password_inputs.type === 'password') {
          password_inputs.type = 'text'
          eye_image=true
          image.src='./openeye.jpg'
      } else {
          password_inputs.type = 'password'
          eye_image=false
          image.src='./closeeye.jpg';
      }
  
})


// --------------------------- Login page Submission --------------------





login_submit.addEventListener('submit',(e)=>{
    const data = {
        email:email_input.value,
        password:password_inputs.value
    }
    
    e.preventDefault()
    
    if(isValid()){
        
        fetch('http://localhost:8080/loginuser',{
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body:JSON.stringify(data)
            
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status === 400){
               show_error(getPara,data.message) 
            }
            else if(data.status === 401){
                show_error(getPara,data.message)
            }else if(data.status === 200){
                window.location.href='/dash'
            }
        }
        
        )
        
    }

})





// -------------------------------------- function for check conditions ------------------

function isValid(){
    let valid = true
  
    
     if(password_error){
        valid=false
        getPara.innerHTML='* Please Fill the Password field correctly'
    }
    if(password_inputs.value === ''){
        valid= false
        show_error(getPara,'Please fill the password field')
    
    }
    if(email_input.value === ''){
        valid= false
        show_error(getPara,'Please fill the email field')
    
    }
    return valid
}






// ------------------- image change in focus event --------------------------

password_inputs.addEventListener('focus',()=>{
    
    if(!eye_image){
       
        
        image.src='./closeeye.jpg';
    
       
    }else{
        image.src = './openeye.jpg'
    }
   
})
password_inputs.addEventListener('focusout',()=>{

    image.src='./panda.png';


})

