const create_emp = document.getElementById('create_emp')
const modal_report=document.getElementById('modal-report')
const emp_name=document.getElementById('emp_name')
const emp_email = document.getElementById('emp_email')
const emp_doj=document.getElementById('emp_doj')
const emp_dob=document.getElementById('emp_dob')
const gender=document.getElementsByName('gender')
const designation = document.getElementById('designations')
const comments = document.getElementById('comments')

const create_success = document.getElementById('create_success')

console.log(designation)

// ----------------error show variable -----------

const name_err = document.getElementById('name_err')

const email_err = document.getElementById('email_err')

const doj_err=document.getElementById('doj_err')

const dob_err=document.getElementById('dob_err')

const cmt_err = document.getElementById('cmt_err')

let name_check;
let email_check;
let comment_check;

let dob_check;
let doj_check;

// ---------------------table sorting -------------------- 

$(document).ready( function () {
    $('#emp_table').DataTable();
} );

// -----------------------form submit for create employeee------------------

create_emp.addEventListener('submit',(e)=>{
    e.preventDefault()
    console.log('hi')
    displayRadioValue()
    modal_report.classList.remove('show')
    modal_report.classList.remove('fade')
  
 
    if(isValid()){
        const data ={
            name:emp_name.value,
            email:emp_email.value,
            doj:emp_doj.value,
            dob:emp_dob.value,
            gender:gender.value,
            designation:designation.value,
            comments:comments.value
        }
        console.log(data)

        fetch('http://localhost:8000/dashboard/create_emp',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status === 200){
                
                $('#CreateEmpModal').modal('show')
                setTimeout(()=>{
                    window.location.href='/dashboard'
                    $('#CreateEmpModal').modal('hide')
                },1000)

            }else if(data.status === 400){
                show_error(email_err,`* ${data.message}`,emp_email)
            }else if(data.status === 501){
                window.location.href='/serverError'
            }
        })
    }
  

    
})



// ----------------- get value in radio -----------

function displayRadioValue() {
    

    for (i = 0; i < gender.length; i++) {
        if (gender[i].checked){
            
            gender.value= gender[i].value;
        }
           
    }
}
// ----------------------keyup event for emp name ---------------

emp_name.addEventListener('keyup',()=>{
    if (emp_name.value.search(/[0-9]/) > 0 || emp_name.value.search(/[0-9]/) === 0 ){
        name_check=false
        show_error(name_err,'Name field doesnot contain a number',emp_name)
    }else if(emp_name.value===''){
        show_error(name_err,'Please fill the value', emp_name)
    }
    else{
        name_check=true
        show_error(name_err,'')
        remove_class(emp_name)
       
    }
})

// ----------------------keyup event for emp email ---------------

emp_email.addEventListener('keyup',()=>{
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(!regex.test(emp_email.value)){
        value=false;
        email_check=false
        show_error(email_err,"* Email is invalid",emp_email)
        }else{
            email_check=true
            show_error(email_err,'')
            remove_class(emp_email)
        }
})
// ----------------------keyup event for emp comment ---------------

comments.addEventListener('keyup',()=>{
    if(comments.value===""){
        comment_check=false
        show_error(cmt_err,"* Please fill the Address value",comments)
    }else{
        comment_check=true;
        show_error(cmt_err,'')
        remove_class(comments)
    }
})

// ----------------------keyup event for emp dob ---------------

emp_dob.addEventListener('change',(e)=>{
    if(e.target.value){
        dob_check = true
        show_error(dob_err,'')
        remove_class(emp_dob)

    }else{
        dob_check=false
       
    }
})

// ----------------------keyup event for emp doj ---------------

emp_doj.addEventListener('change',(e)=>{
    if(e.target.value){
        doj_check = true
        show_error(doj_err,'')
        remove_class(emp_doj)
    }else{
        doj_check=false
        
    }
})

// -------- function for create employee valid --------

function isValid(){
    let value=true

    if(emp_name.value === '' && emp_email.value==='' && emp_dob.value === '' && emp_doj.value === '' && comments.value === '' ){
        value =false
        show_error(name_err,"* Please fill the employee name",emp_name)
       
        show_error(email_err,'* Please fill the email',emp_email)
        show_error(dob_err,"* Please fill the dob ",emp_dob)
        show_error(doj_err,"* Please fill the dob ",emp_doj)
        show_error(cmt_err,"* Please fill the Address",comments)
    }else if(emp_name.value === ''){
        value=false
        show_error(name_err,"* Please fill the employee name",emp_name)
    }else if(emp_email.value === ''){
        value=false;
        show_error(email_err,'* Please fill the email',emp_email)
    }else if(emp_doj.value === ''){
        value=false
            show_error(doj_err,"* Please fill the dob ",emp_doj)
    }
    else if(emp_dob.value === ''){
        value=false
            show_error(dob_err,"* Please fill the dob ",emp_dob)
    }else if(comments.value === ''){
            value=false;
            show_error(cmt_err,"* Please fill the Address",comments)
    }else if(!name_check){
            value=false;
            show_error(name_err,'* Please check the name field',emp_name)
    }else  if(!email_check){
            value=false;
            show_error(email_err,'* Please check the email input',emp_email)
    }else if(!comment_check){
        value=false;
        show_error(cmt_err,"* Please check the Address field ",comments)
    }else if(!dob_check){
            value=false;
            show_error(dob_err,"* please check the dob field",emp_dob)
    }else  if(!doj_check){
            value=false;
            show_error(dob_err,"* please check the dob field",emp_doj)
    }

   
    return value
    
}

// ------------show error function --------

const show_error = (err,msg,ele)=>{
    err.innerHTML = `${msg}`
    ele?.classList.add('is-invalid')
}
// -------------------remove class ------------

const remove_class = (remove_class)=>{

    remove_class.classList.remove('is-invalid')
    remove_class.classList.add('is-valid')

}


// ----------------null value for click cancel -------------------


const removes = (remove_invalid)=>{
    remove_invalid.classList.remove('is-invalid')
    remove_invalid.classList.remove('is-valid')
}

const value_null = ()=>{
    emp_name.value='';
    emp_dob.value='';
    emp_doj.value='';
    emp_email.value='';
    comments.value='';
    show_error(name_err,"")
    show_error(email_err,"")
    show_error(dob_err,"")
    show_error(doj_err,"")
    show_error(cmt_err,"")
    removes(emp_name)
    removes(emp_email)
    removes(emp_dob)
    removes(emp_doj)
    removes(comments)

}

// --------------------close button for create employee----------------------

close_btn.addEventListener('click',(e)=>{
    e.preventDefault()
  console.log('candfs')
value_null()

})

// --------------- cancel modal in create employee-------------------

cancel_modal.addEventListener('click',(e)=>{
    e.preventDefault()
   
    value_null()
})

$('#cancel_update_modal').click(()=>{
    update_valueNull()
})
$('#cancel_update_modalIcon').click(()=>{
    update_valueNull()
})

const update_valueNull=()=>{
    show_error(up_name_err,"")
    show_error(up_email_err,"")
    show_error(up_doj_err,"")
    show_error(up_dob_err,"")
    show_error(up_cmt_err,"")
    removes(up_name)
    removes(up_email)
    removes(up_doj)
    removes(up_dob)
    removes(up_comment)
}
const select_last = document.getElementById('select_last')

$(document).ready(()=>{

    const date = new Date().getMonth()
 $('#get_month').val(date)
    const month = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec']

month.map((value)=>{
    $('#select_last').append(`<option class='dropdown-item' value='${value}'>${value}</option>`)
})


    fetch('json/data.json',{
        method:"GET",
        headers:{
            "Content-Type" : "application/json"
        }
    })
    .then(data =>data.json())
    .then((data) => {


      const values = data.transaction[0]
        

   

      $('#total_transaction').html(`${values.all.total} Total Transaction`)
      $('#pending_transaction').html(`${values.onhold.total} waiting payments`)
      $('#credit_card_total').html(`${values.credit_total} Credit Card Transaction`)
      $('#credit_card_pending').html(`${values.onhold.credit.total} waiting payments`)
      $('#debit_card_total').html(`${values.debit_total} Debit Card Transaction`)
      $('#debit_card_pending').html(`${values.onhold.debit.total} waiting payments`)
      $('#invoice_total').html(`${values.invoice_total} Invoice Transaction`)
      $('#invoice_pending').html(`${values.onhold.invoice.total} waiting payments`)

     const per_value = values.all.month.find((value,index)=>{
        console.log(index)
        console.log(date)
        if(index === date){
            return value
        }
      })

      $("#trans_per").html(`${per_value}`)

      $('#select_last').on('change',(e)=>{
        const month_index = select_last.selectedIndex-1;
        const get_value = values.all.month.find((value,index)=>{
            console.log(index)
            console.log(month_index)
            if(index === month_index){
                return value
            }
          })
          if(month_index >= 0){
            $("#trans_per").html(`${get_value}`)
          }else {
            $("#trans_per").html(`${per_value}`)
          }
         
    })
    
    })
  
})




