// -----------------variable declaration ------------------------_

const form = document.getElementById('form')
const emp_name = document.getElementById('name')
const dob = document.getElementById('dob')
const date_of_join = document.getElementById('doj')
const gender = document.getElementsByName('gender')
const designation = document.getElementById('designation')
const comments = document.getElementById('comment')

const name_err = document.getElementById('err_name')
const err_dob = document.getElementById('err_dob')
const err_doj = document.getElementById('err_doj')
const err_gen = document.getElementById('err_gen')

const male = document.getElementById('male')
const female = document.getElementById('female')
const others = document.getElementById('others')

const show_success_msg = document.getElementById('show_success')

let name_num_err = false


function show_success(success, message){
    success?.classList?.add('show_success')
    success.innerHTML=`${message}`

}


form.addEventListener('submit',(e)=>{
    e.preventDefault()
  
    displayRadioValue()
    if(isValid()){
        const data = {
            name : emp_name.value,
            dob : dob.value,
            doj:date_of_join.value,
            gender:gender.value,
            designation:designation.value,
            comments:comments.value
        }
    console.log(data)
         fetch('http://localhost:8080/dash/get_details_employee',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status === 200){
                show_success(show_success_msg, "Form submitted successfully")
                setTimeout(()=>{
                    window.location.href = '/dash'
                },1000)
            }
        }).catch((err)=>console.log(err))
    }
  

})


//  -----------------radio btn checked --------------------
function displayRadioValue() {
    

    for (i = 0; i < gender.length; i++) {
        if (gender[i].checked){
            
            gender.value= gender[i].value;
        }
           
    }
}

// ---------------------------show error msg ------------

function show_error(err,message,show){
    err.innerHTML=`* ${message}`
    show?.classList?.add('animate')


}

// ------------------clear error --------------

function clear_err (err,clear)
{
    
    err.innerHTML = ''
    clear?.classList?.remove()
}
function isValid(){
    let isvalid = true
    if(emp_name.value === ''){
        isvalid=false;
        show_error(name_err,"Please fill the Name input",emp_name)
    } if(dob.value === ''){
        isvalid=false;
        show_error(err_dob,"Please enter the Date of birth",dob)
    }
    if(name_num_err){
        isvalid=false;
        show_error(name_err,"Name field did not contain a number",emp_name)
    }
    
    if(date_of_join.value === ''){
        isvalid=false;
        show_error(err_doj,"Please enter the Date of joining",date_of_join)
    } if(!gender.value){
        isvalid=false;
        show_error(err_gen,"Please select the gender",gender)
    }
    return isvalid

}


emp_name.addEventListener('keyup',()=>{
    
    
    emp_name?.classList?.remove('animate')
    name_err.innerHTML=''
    if (emp_name.value.search(/[0-9]/) > 0 || emp_name.value.search(/[0-9]/) === 0 ) {
        
        show_error(name_err, 'Name field did not contain a number',emp_name)
        name_num_err=true
    }else{
        name_num_err=false
    }
})

dob.addEventListener('change',(e)=>{
    if(e.target.value){
        clear_err(err_dob,dob)
    }

})
date_of_join.addEventListener('change',(e)=>{
    if(e.target.value){
        clear_err(err_doj,date_of_join)
    }
})

male.addEventListener('click',()=>{
    clear_err(err_gen,gender)
})
female.addEventListener('click',()=>{
    clear_err(err_gen,gender)
})
others.addEventListener('click',()=>{
    clear_err(err_gen,gender)
})