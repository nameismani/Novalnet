
// ----------------get id from url ------------------

const get_id = (window.location.href.split('/'))
const id = get_id[get_id.length - 1]

// ------------------variable declare ----------------------

const names = document.getElementById('name')
const dob = document.getElementById('dob')
const doj = document.getElementById('doj')
const btn = document.getElementById('btn')
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



let data;
let name_num_err;


window.addEventListener('load',()=>{
    fetch(`http://localhost:8080/dash/single_id/${id}`).then((res)=>res.json())
    .then((data)=> {
        
        data=data.data
     
        names.value = data.name
        dob.value = date_value(data.dob).join('-')
        doj.value = date_value(data.joiningDate).join('-')
        comments.value=data.comment
        console.log(gender.length)
        for (i = 0; i < gender.length; i++) {
            if (data.gender==='male'){
                
                gender[0].checked=true
            }else if (data.gender === 'female'){
                gender[1].checked=true
            }else{
                gender[2].checked=true
            }
               
        }
        


    })
    .catch((err)=>console.log(err))




})


const date_value = (dates)=>{
    const dates_valid = dates.split(':')[0].split('T')
    dates_valid.splice(1,1)
    
    return dates_valid

}

function displayRadioValue() {
    

    for (i = 0; i < gender.length; i++) {
        if (gender[i].checked){
            
            gender.value= gender[i].value;
        }
           
    }
}

btn.addEventListener('click',(e)=>{
    displayRadioValue()
    e.preventDefault()
    if(isValid()){
        const data = {
            name : names.value,
            dob : dob.value,
            doj:doj.value,
            gender:gender.value,
            designation:designation.value,
            comments:comments.value
        }
       
        fetch(`http://localhost:8080/update/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status ===200){
                show_success(show_success_msg, "Form submitted successfully")

                setTimeout(()=>{
                    window.location.href = `/dash/view/admin`
                },1000)
            }
        })
        .catch((err)=>console.log(err))
    }
    
})

function isValid(){
    let isvalid = true
    if(names.value === ''){
        isvalid=false;
        show_error(name_err,"Please fill the Name input",names)
    } if(dob.value === ''){
        isvalid=false;
        show_error(err_dob,"Please enter the Date of birth",dob)
    }
    if(name_num_err){
        isvalid=false;
        show_error(name_err,"Name field did not contain a number",names)
    }
    
    if(doj.value === ''){
        isvalid=false;
        show_error(err_doj,"Please enter the Date of joining",dob)
    } if(!gender.value){
        isvalid=false;
        show_error(err_gen,"Please select the gender",gender)
    }
    return isvalid

}

names.addEventListener('keyup',()=>{
    
    
    names?.classList?.remove('animate')
    name_err.innerHTML=''
    if (names.value.search(/[0-9]/) > 0 || names.value.search(/[0-9]/) === 0 ) {
        
        show_error(name_err, 'Name field did not contain a number',names)
        name_num_err=true
    }else{
        name_num_err=false
    }
})

// ------------------------show error-------------

function show_error(err,message,show){
    err.innerHTML=`* ${message}`
    show?.classList?.add('animate')


}
male.addEventListener('click',()=>{
    clear_err(err_gen,gender)
})
female.addEventListener('click',()=>{
    clear_err(err_gen,gender)
})
others.addEventListener('click',()=>{
    clear_err(err_gen,gender)
})

// ----------------- error clear -----------------

function clear_err (err,clear)
{
    
    err.innerHTML = ''
    clear?.classList?.remove()
}
 
// ---------------success msg ----------------
 
function show_success(success, message){
    success?.classList?.add('show_success')
    success.innerHTML=`${message}`

}