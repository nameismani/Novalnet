const url = window.location.href.split('/')
let users = (url[url.length - 1])

let table = document.getElementById("tb");
const delete_btn = document.getElementById('delete')
const success_notify = document.getElementById('show_success')
const append = document.getElementById('append_input')
const select_multiple = document.getElementById('select_multiple')
let checking;
let date_join;
let date_birth;
let comment;
let show_select=false
const  create_elements = document.createElement('div')
window.addEventListener('load',()=>{
   
    fetch('http://localhost:8080/dash/get_table_view',{
        method:"GET",
        headers:{
            "Content-Type" : "application/json"
        }
    }).then((res)=>res.json())
    .then((data)=>{
        if(data.status === 200){
           if(data.data.length === 0){
            $('#noData').append(`<div class="no_data"><h4>No Data,Create data using admin portal dashboard </h4></div>`)
           select_multiple.style.display='none'
        }else{
              
            data.data.map((value,index)=>{
                if(value.comment === ""){
                    comment='-'
                }else{
                    comment=value.comment
                }
                console.log(value)
                date_birth=date_value(value.dob)
                date_join=date_value(value.joiningDate)
                if(users === 'user'){
                    $('#body').append(`<tr><td id='display' class='none'><input value=${value.id} name="" class='checkbox' type='checkbox'/></td> <td>${index+1}</td><td>${value.name}</td><td>${date_birth.join('/')}</td><td>${date_join.join('/')}</td><td>${value.gender}</td><td>${value.designation}</td><td>${comment}</td>   </tr>`)
            
                }else if (users==='admin'){
                    $('#body').append(`<tr><td id='display' class='none'><input value=${value.id} name="" class='checkbox' type='checkbox'/></td> <td>${index+1}</td><td>${value.name}</td><td>${date_birth.join('/')}</td><td>${date_join.join('/')}</td><td>${value.gender}</td><td>${value.designation}</td><td>${comment}</td><td  class="buttons"><a  href='/dash/update/${value.id}' class='update_button' >Update</a><a class='delete' onclick="deletes(${value.id})">Delete</a></td>   </tr>`)
     
                }
          }
            
            )
           }
          
           
        }
    })
})

const show_success = (success_notify,message)=>{
success_notify.innerHTML = `${message}`
success_notify.classList.add('show_success')
}


async function fetch_delete(id){
   await  fetch(`http://localhost:8080/dash/delete/${id}`,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        }

    }).then((res)=>res.json())
    .then((data)=>{
        console.log(data)
        if(data.status  === 200){
            show_success(success_notify,data.message)
            setTimeout(()=>{
               window.location.reload()
            },1000)
        }
    })
    .catch((err)=>console.log(err))
}


function deletes(id){
    const confirmation = confirm("Are you sure , You want to delete this record ?")
    if(confirmation){
        fetch_delete(id)
        
    }
    
}


const date_value = (dates)=>{
    const dates_valid = dates.split(':')[0].split('-').reverse().map((value,index)=> value.split('T') ).flat()
    dates_valid.splice(1,1)
    return dates_valid

}

$("#select_multiple").click(function(e){
  
e.preventDefault()
$('.none').removeClass('none')

})

$("#delete_all").click((e)=>{
    e.preventDefault()
    const check_box = document.querySelectorAll('.checkbox')

    console.log(check_box)
    for(i = 0 ; i<check_box.length ; i++){
        if(check_box[i].checked){
            
           checking=true
           break
           
        }else{
            checking=false
        }
    }
    console.log(checking)
    if(checking){
        const confirmation = confirm("Are you sure, You want to delete this all items ? ")
        if(confirmation){
            for(i = 0 ; i<check_box.length ; i++){
                if(check_box[i].checked){
                    const value = check_box[i].value
                    fetch_delete(value)
                }
            }
        }
    }else if (!checking){
    confirm("Please select any one to delete")
    }
    
    
   
})

$('#dash_btn').click((e)=>{
    e.preventDefault()
    if(users === 'admin'){
        window.location.href=`/dash`
    }else{
        window.location.href='/user_portal'
    }
 
})

