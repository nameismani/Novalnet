
let emp_id = 0;

const get_id=(id)=>{
    return emp_id=id
}


const delete_success=document.getElementById('delete_success')

const close_btn =  document.getElementById('close_btn')

const cancel_modal=document.getElementById('cancel_modal')

const up_name = document.getElementById('up_name')

const up_email = document.getElementById('up_email')

const up_doj = document.getElementById('up_doj')

const up_dob = document.getElementById('up_dob')

const radio = document.getElementsByName('report-type')

const designation_up = document.getElementById('designations2')



const desi = document.getElementsByName('desi')

const up_comment = document.getElementById('up_comments')

const update_emp_form=document.getElementById('update_emp')

const check_del=document.getElementsByName('check_del')

const all_delete_checkbox = document.getElementById('all_delete_checkbox')

const up_name_err = document.getElementById('up_name_err')

const up_email_err = document.getElementById('up_email_err')

const up_doj_err=document.getElementById('up_doj_err')

const up_dob_err=document.getElementById('up_dob_err')

const up_cmt_err = document.getElementById('up_cmt_err')

const emp_update_success =document.getElementById('emp_update_success')

const delete_item=document.getElementById('delete_item')

let up_comment_check = true;

let up_email_check=true;

let up_name_check=true

let delte_id = 0


$(document).ready(()=>{
    fetch('http://localhost:8000/get_user_details',{
        method:"GET",
        headers:{
            "Content-Type" :"application/json"
        },

    }).then((res)=>res.json())
    .then((data)=>{
        top_image.src = `uploads/${data.data.Image}`
      
    })
})



const dlt_id=(id)=>{
    return delte_id=id
}


// ------------------------- delete all modal button---------------------------


$('#all_delete').click((e)=>{
    e.preventDefault()
    for (i = 0; i < check_del.length; i++) {
        if (check_del[i].checked){
            
            check_del.value= check_del[i].value;
           
            delete_id(check_del.value)
         
        }
        
           
    }
   
 
})
// --------------------modal show only check true  --------------

$('#btn_for_dele').click((e)=>{
    for (i = 0; i < check_del.length; i++) {
        if(check_del[i].checked){
            $('#modal_delete').modal('show')
        }
    }
})

// ---------------------------------- delete function --------------------- 

const delete_id = (id)=>{
    fetch(`http://localhost:8000/dashboard/delete/${id}`,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        }
       })
       .then((res)=>res.json())
       .then((data)=>{
        if(data.status === 200){
            $('#delete_successful').modal('show')
            setTimeout(()=>{
                window.location.href='/dashboard'
                $('#delete_successful').modal('hide')
            },1000)
            
        }
       })
}

// ---------------------delete particular item click modal -----------------------


delete_item.addEventListener('click',()=>{
    
    delete_id(delte_id)
    
})

// ------------------- onclick delete btn -----------------------------------


function delete_btn(id){
dlt_id(id)//store a variable for delete after the modal open
    
}


// ---------------------update function -------- 

function update_btn(id){
    fetch(`http://localhost:8000/dashboard/update/${id}`,{
        method:"GET",
        headers:{
            "Content-type":"application/json"
        }

    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data)
        if(data.status === 200){
            const datas = data.data[0]
          
            up_name.value = datas.Emp_name
            up_email.value = datas.Email
            up_doj.value = datas.Doj
            up_dob.value = datas.Dob
            if(datas.Gender === 'male'){
                radio[0].checked = true
                radio.value=radio[0].value
            }else if (datas.Gender ==='female'){
                radio[1].checked = true
                radio.value=radio[1].value
            }else{
                radio[2].checked=true
                radio.value=radio[2].value
            }
            designation_up.value=datas.Designation
            up_comment.value=datas.Comment
           
            get_id(datas.id)
            // get_old_value(up_name.value,'name_update')
            // get_old_value(up_doj.value,'doj_update')
            // get_old_value(up_dob,'dob_update')
            // get_old_value(radio.value,'radio_update')
            // get_old_value(designation_up.value,'designation_update')
            // get_old_value(up_comment.value,'comment_update')
        }else if(data.status===501){
            window.location.href='/serverError' 
        }else{
            $('#params_not_valid').modal('show') 
        }
        
    
    }
        
        
        )
}

// -------------------get radio value ---------------

function displayRadio() {
    

    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked){
            
            radio.value= gender[i].value;
        }
           
    }
}

// --------------------- update submit --------------

update_emp_form.addEventListener('submit',(e)=>{
   
    e.preventDefault()
    displayRadio()
    if(valid_updated()){
       const updated_data = {
        id:emp_id,
        name:up_name.value,
        email:up_email.value,
        dob:up_dob.value,
        doj:up_doj.value,
        gender:radio.value,
        designation:designation_up.value,
        comment:up_comment.value

       }
       
       fetch('http://localhost:8000/dashboard/update/success',{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(updated_data)
    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data)
        if(data.status === 200){
            $('#update_successfuly').modal('show')  
            setTimeout(()=>{
                window.location.href='/dashboard';
                $('#update_successfuly').modal('hide')  
            },1000)
        }else if(data.status === 400){
            if(data.error === 'employee'){
                $('#updateError').modal('show')
            }

        }else if(data.status === 501){
            window.location.href='/serverError'
        } else{
            $('#updateError').modal('show')  
        }
        
    }
    )
    }

    
    
})

// ------------------ keyup event for updated email -----------

up_email.addEventListener('keyup',()=>{
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(!regex.test(up_email.value)){
        up_email_check=false
        show_error(up_email_err,"* Email is invalid",up_email)
        }else{
            up_email_check=true
            show_error(up_email_err,'')
            remove_class(up_email)
        }
})
// ------------------ keyup event for updated comment -----------

up_comment.addEventListener('keyup',()=>{
    if(up_comment.value===""){
        up_comment_check=false
        show_error(up_cmt_err,"* Please fill the comments value",up_comment)
    }else{
        up_comment_check=true;
        show_error(up_cmt_err,'')
        remove_class(up_comment)
    }
})

// ------------------ keyup event for updated name -----------

up_name.addEventListener('keyup',()=>{
    if (up_name.value.search(/[0-9]/) > 0 || up_name.value.search(/[0-9]/) === 0 ){
        up_name_check=false
        show_error(up_name_err,'Name field doesnot contain a number',up_name)
    }else{
        up_name_check=true;
        show_error(up_name_err,'')
        remove_class(up_name)
    }
})

// ------------------ function for valid in updated -----------

function valid_updated(){

    let value= true;

    if(up_name.value ==='' && up_dob.value === '' && up_doj.value ==='' && up_comment.value ===''){
        value = false;
        show_error(up_name_err,"* Please fill the employee name",up_name)
        show_error(up_dob_err,"* Please fill the dob ",up_dob)
        show_error(up_doj_err,"* Please fill the dob ",up_doj)
        show_error(up_cmt_err,"* Please fill the comment",up_comment)
    }else if(up_name.value === ''){
        value=false
        show_error(up_name_err,"* Please fill the employee name",up_name)
    }else if(up_dob.value === ''){
            value=false
            show_error(up_dob_err,"* Please fill the dob ",up_dob)
    }else if(up_doj.value === ''){
        value=false
        show_error(up_doj_err,"* Please fill the dob ",up_doj)
    }else if(up_comment.value === ''){
        value=false;
        show_error(up_cmt_err,"* Please fill the comment",up_comment)
    }else if (!up_name_check){
        value=false;
        show_error(up_name_err,'* Please check the name field',up_name)
    }else if(!up_email_check){
        value=false;
            show_error(up_email_err,'* Please check the email input',up_email)
    }else if(!up_comment_check){
        value=false;
        show_error(up_cmt_err,"* Please check the comment field ",up_comment)
    }
  
    return value

}


// ---------------- click event for checkbox ------------------

$('#all_delete_checkbox').click((e)=>{
    if(all_delete_checkbox.checked){
        for (i = 0; i < check_del.length; i++) {
        check_del[i].checked=true
      
      
            }
            
               
        
    }else{
        for (i = 0; i < check_del.length; i++) {
            check_del[i].checked=false
            
  }
    }

})

// ------------------- get old value --------------------

let old_name_value ;
let old_doj_value;
let old_dob_value;
let old_radio_value;
let old_designation_value;


// const get_old_value = (value, type)=>{

//     if(type === 'name_update'){
//         return old_name_value = value
//     }else if(type === 'doj_update'){
//         return old_doj_value = value
//     }else if ( type === 'dob_update'){
//         return old_dob_value = value
//     }else if ( type === 'radio_update'){
//         return old_radio_value = value
//     }else if ( type === '')

// }
