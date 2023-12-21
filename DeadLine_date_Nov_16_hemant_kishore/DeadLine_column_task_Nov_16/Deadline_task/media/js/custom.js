import {HttpClient} from './http-client.service.js';

const client = new HttpClient();
const ticketNavLink = document.querySelectorAll('.ticket_nav_link');
const activityNavLink = document.querySelectorAll('.activity_nav_link');
const commentsNavLink = document.querySelectorAll('.comments_nav_link');
const userNavLink = document.querySelectorAll('.user_nav_link');
const singleCheckbox = document.querySelectorAll('.single-ticket-checkbox');
// const tableRows = document.querySelectorAll('.ticket-rows');
const createUser = document.querySelector('.create-user');
const first_name = document.querySelector('#first_name');
const last_name = document.querySelector('#last_name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const abbreviation = document.querySelector('#abbreviation');
const start_date = document.querySelector("#start_date")
const end_date = document.querySelector("#end_date")
const status =  document.querySelector("#status")
const creation_date = document.querySelector("#creation_date")


if (createUser != undefined)
{
    [first_name, last_name, email, password, abbreviation].forEach(element => {
        element.addEventListener('click', (event) => {
            element.classList.remove('is-invalid');
            if(element.type == 'password')
            {
                document.querySelector('#show-password').classList.remove('password-error');
            }
        });
    });

    createUser.addEventListener('click', (event) => {
        const company = document.querySelector('#company').value;
        const admin = document.querySelector('#admin').checked;

        var isError = false;
        [first_name, last_name, email, password, abbreviation].forEach(element => {
            if (element.value.trim() == '')
            {
                isError = true;
                element.classList.add('is-invalid');
                if(element.type == 'password')
                {
                    document.querySelector('#show-password').classList.add('password-error');
                }
            }
        });
        if (isError)
        {
            return false;
        }

        client.post('/api/user/create', JSON.stringify({'company' : company, 'first_name' : first_name.value, 'last_name' : last_name.value, 'email' : email.value, 'password' : password.value, 'abbreviation' : abbreviation.value, 'admin' : admin}), (response, request) => {
            if (request.status != 200)
            {
                response = JSON.parse(response);
                showErrorMessage(response);
            } else {
                location.reload();
            }
        });

    });
}

if (ticketNavLink != undefined)
{
    ticketNavLink.forEach((element) => {
        element.addEventListener('click', (event) => {
            var pageToLoad = event.target.getAttribute('data-pagetoload');
            document.querySelector('#page').value = pageToLoad;
            document.querySelector('#ticket_form').submit();
        });
    });
}

if (activityNavLink != undefined)
{
    activityNavLink.forEach((element) => {
        element.addEventListener('click', (event) => {
            var pageToLoad = event.target.getAttribute('data-pagetoload');
            document.querySelector('#activityPage').value = pageToLoad;
            document.querySelector('#activityForm').submit();
        });
    });
}

if (commentsNavLink != undefined)
{
    commentsNavLink.forEach((element) => {
        element.addEventListener('click', (event) => {
            var pageToLoad = event.target.getAttribute('data-pagetoload');
            document.querySelector('#commentPage').value = pageToLoad;
            document.querySelector('#commentsForm').submit();
        });
    });
}

if (userNavLink != undefined)
{
    userNavLink.forEach((element) => {
        element.addEventListener('click', (event) => {
            var pageToLoad = event.target.getAttribute('data-pagetoload');
            document.querySelector('#page').value = pageToLoad;
            document.querySelector('#users_form').submit();
        });
    });
}


if (document.querySelector('#submit_filter_form_button') != undefined)
{
    document.querySelector('#submit_filter_form_button').addEventListener('click', (event) => {
        document.querySelector('#filter').value = 1;
        document.querySelector('#page').value = 1;
        document.querySelector('#ticket_form').submit();
    });
}

if (document.querySelector('#reset_filter_form_button') != undefined)
{
    document.querySelector('#reset_filter_form_button').addEventListener('click', (event) => {
        ['ticket_no', 'subject', 'list_status', 'list_priority', 'list_assignees', 'application', 'server', 'subTickets', 'filter_date_range', 'datepicker-icon-prepend'].forEach((field) => {
            if (document.querySelector('#' + field) != undefined)
            {
                if (document.querySelector('#' + field).tagName.toLowerCase() == 'input')
                {
                    document.querySelector('#' + field).value = '';
                } else {
                    document.querySelector('#' + field).value = 0;
                }
            }
        });
        document.querySelector('#page').value = 1;
        document.querySelector('#ticket_form').submit();
    });
}

if (document.querySelector('#filter-button') != undefined)
{
    document.querySelector('#filter-button').addEventListener('click', (event) => {
        if(document.querySelector('.filter-block').style.display == 'none')
        {
            document.querySelector('.filter-block').style.display = 'block';
        } else {
            document.querySelector('.filter-block').style.display = 'none';
        }
    });
}

if (document.querySelector('#filter-button') != undefined)
{
    document.querySelector('.all-ticket-checkbox').addEventListener('click', (event) => {
        singleCheckbox.forEach((element) => {
            if (event.target.checked == true)
            {
                element.checked = true;
            } else {
                element.checked = false;
            }
        });
    });
}

if (document.querySelector('.subtickets-header') != undefined)
{
    document.querySelector('.subtickets-header').addEventListener('click', (event) => {
        if (document.querySelector('.subtickets-body').style.display == 'none')
        {
            document.querySelector('.subtickets-body').style.display = 'block';
        } else {
            document.querySelector('.subtickets-body').style.display = 'none';
        }
    });
}

singleCheckbox.forEach((element) => {
    element.addEventListener('click', (event) => {
        if (element.checked == false)
        {
            document.querySelector('.all-ticket-checkbox').checked = false;
        } else {
            document.querySelector('.all-ticket-checkbox').checked = true;
        }
    });
});

['assignees', 'status', 'priority'].forEach((field) => {
    if (document.querySelector('#' + field) != undefined)
    {
        document.querySelector('#' + field).addEventListener('change', (event) => {
            console.log(event.target)
            if (confirm("Are you sure you want to change the " + field + " ?") == true) {
                const ticketId = document.querySelector('#ticketId').value;
                var jsonData;
                if (field == 'status') { 
                    var jsonData = {'status' : document.querySelector('#' + field).value};
                } else if (field == 'assignees') {
                    var jsonData = {'assignees' : document.querySelector('#' + field).value};
                } else{
                    var jsonData = {'priority' : document.querySelector('#' + field).value};
                }
                client.post('/tickets/update/' + ticketId, JSON.stringify(jsonData), (response, request) => {
                    location.reload();
                });
            } else {
              text = "You canceled!";
            }
        });     
    }
});

if(document.querySelector("#start_date") != undefined && document.querySelector("#end_date") != undefined ){

    const ticketId = document.querySelector('#ticketId').value;
    let currentDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    currentDate = new Date(currentDate)
    
    document.addEventListener("DOMContentLoaded",function () {

        let startDate = start_date.value
        let endDate = end_date.value
        console.log(start_date.value);

        if(endDate != '' && endDate.length > 0){

            let deadLine_EndDate = end_date.value.split("/")
            const endDate = deadLine_EndDate[1] + '/' + deadLine_EndDate[0] + '/' + deadLine_EndDate[2]
             
            if(new Date(endDate) < currentDate && status.value != 6){

            $('#end_date').attr("data-bs-original-title","You are crossed the deadline")
            $('#end_date').tooltip({trigger:'manual', placement:'top'}).tooltip('show');  
            end_date.classList.add('border-danger','text-danger','custom-end-date')
            document.querySelector("#endDate_calender").setAttribute("stroke","#d9534f")
              setTimeout(()=>{
                 $('#end_date').tooltip('hide')
              },3000)
            }
              
        }else{
            console.log('top validate');
            end_date.classList.remove("text-danger","border-danger","custom-end-date")
            document.querySelector("#endDate_calender").setAttribute("stroke","currentColor")
            // $('#end_date').tooltip('hide'); 
        }

        if(window.Litepicker && status.value != 6 ){
             start_date.disabled = false
             end_date.disabled = false
         
            let deadlineInput_startDate = document.getElementById('start_date');
            let deadlineInput_endDate = document.getElementById('end_date');

          
            let startPicker = new Litepicker({
          element: deadlineInput_startDate,
          format: 'DD/MM/YYYY',
          singleMode: true,
          numberOfMonths: 1,
          numberOfColumns: 1,
          showTooltip: true,    
          scrollToDate: true,
          dropdowns: {
            months: true,
           },
          buttonText: {
            apply:start_date.value.length > 0 ? 'Update' : 'Apply',
            reset:`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-reload" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"></path>
            <path d="M20 4v5h-5"></path>
         </svg>`,
            previousMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="15 6 9 12 15 18" /></svg>`,
            nextMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="9 6 15 12 9 18" /></svg>`,
           },
    
           minDate: reverseDate(creation_date.value),
           maxDate: end_date.value && end_date.value.length > 0 ?  reverseDate(end_date.value) : null,
           highlightedDays : [reverseDate(start_date.value) != reverseDate(end_date.value)? reverseDate(end_date.value):null],
           autoApply:false,
        
        setup: function(picker){
            picker.on('preselect',function(ele){
                
            const selectedDate = picker.datePicked[0].dateInstance
            deadlineInput_startDate.value = changeFormatDate(selectedDate)
               
    
        picker.on('selected', function(date) {   
               
            let deadLine_startDate = date.dateInstance.toISOString().slice(0, 19).replace("T", " ");
            const jsonData = {
                ticketId : ticketId,
                deadLine : {
                    startDate:changeFormatDate(selectedDate),
                    endDate:null,
                } 
            }
           
            if(date.dateInstance.toDateString() == selectedDate.toDateString()
             && changeFormatDate(selectedDate) != startDate){
               
                client.post('/tickets/update/' + ticketId, JSON.stringify(jsonData), (request,response) => {
                    setTimeout(()=>{
                   window.location.reload();
                    },1500)
                    
                });
            }
          
        })
     })
        }
        });

            let endPicker = new Litepicker({
            element: deadlineInput_endDate,
            format: 'DD/MM/YYYY',
            singleMode: true,
            numberOfMonths: 1,
            numberOfColumns: 1,
            showTooltip: true,    
            scrollToDate: true,  
            dropdowns: {
              months: true,
            },
            buttonText: {
                apply:end_date.value.length > 0 ? 'Update' : 'Apply',
              reset:`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-reload" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"></path>
              <path d="M20 4v5h-5"></path>
           </svg>`,
              previousMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="15 6 9 12 15 18" /></svg>`,
              nextMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="9 6 15 12 9 18" /></svg>`,
            },
            minDate: start_date.value && start_date.value.length > 0 ? reverseDate(start_date.value) :reverseDate(creation_date.value),
            highlightedDays : [reverseDate(end_date.value) != reverseDate(start_date.value) ? reverseDate(start_date.value) : null , reverseDate(creation_date.value)],
            autoApply:false,
  
          setup: function(picker){
              picker.on('preselect',(element)=>{
              const selectedDate = picker.datePicked[0].dateInstance
              console.log(picker.datePicked[0].dateInstance);
              deadlineInput_endDate.value = changeFormatDate(selectedDate)

                  let deadLine_startDate = start_date.value.split("/")
                  let startDate = deadLine_startDate[1] + '/' + deadLine_startDate[0] + '/' + deadLine_startDate[2] 
                  let startSelectedDate = new Date(startDate)

                  if(end_date.value.length == 0){

                      end_date.classList.remove("text-danger","border-danger",'custom-end-date')
                      document.querySelector("#endDate_calender").setAttribute("stroke","currentColor")
                      $('#end_date').tooltip('hide');
                    
                  }
                  if(selectedDate < currentDate && status.value != 6){

                    $('#end_date').attr("data-bs-original-title","Selected date is crossed the deadline")
                    $('#end_date').tooltip({trigger:'manual', placement:'top'}).tooltip('show');  
                    console.log('in')
                    deadlineInput_endDate.value = changeFormatDate(selectedDate)  
                    end_date.classList.add('border-danger')
                    document.querySelector("#endDate_calender").setAttribute("stroke","#d9534f")
               
                    setTimeout(()=>{
                        $('#end_date').tooltip('hide');
                    },3000)
                  }
                  else{

                     console.log('out')
                     end_date.classList.remove("text-danger","border-danger",'custom-end-date')
                     document.querySelector("#endDate_calender").setAttribute("stroke","currentColor")
                     $('#end_date').tooltip('hide');
                   
                  }

                picker.on('selected', function(date) {   
                    console.log('server =>', date)
                    let deadLine_endDate = date.dateInstance.toISOString().slice(0, 19).replace("T", " ");
                    const jsonData = {
                        ticketId : ticketId,
                        deadLine : {
                           startDate:null,
                           endDate : changeFormatDate(date)
                        } 
                    }    
                    if(date.dateInstance.toDateString() == selectedDate.toDateString() 
                    && changeFormatDate(selectedDate) != endDate){
                        client.post('/tickets/update/' + ticketId, JSON.stringify(jsonData), (request,response) => {
                            setTimeout(()=>{
                                   window.location.reload();
                            },1500)
                                    
                        });            

                    }
                    
            }) 

              })
          },
           
          });  
        
    }else{
        start_date.disabled = true
        start_date.style.cursor ="not-allowed"
        end_date.disabled = true
        end_date.style.cursor ="not-allowed"

        end_date.classList.remove("text-danger","border-danger","custom-end-date")
        document.querySelector("#endDate_calender").setAttribute("stroke","currentColor")
    }

}) 

document.addEventListener("click",(e)=>{
  
 if(e.target.id != 'end_date' && status.value !=6 ){
    if(end_date.value != '' && end_date.value.length > 0){

        let deadLine_EndDate = end_date.value.split("/")
        const endDate = deadLine_EndDate[1] + '/' + deadLine_EndDate[0] + '/' + deadLine_EndDate[2]
         
        if(new Date(endDate) < currentDate){

        end_date.classList.add('border-danger','text-danger','custom-end-date')
        document.querySelector("#endDate_calender").setAttribute("stroke","#d9534f")

        }
          
    }else{
        end_date.classList.remove("text-danger","border-danger","custom-end-date")
        document.querySelector("#endDate_calender").setAttribute("stroke","currentColor")
        
    }
 }

})

}

function reverseDate(date){
    if(date.includes("/")){
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`
    }else{

        const [day, month, year] = date.split('.');
        return `${year}-${month}-${day}`
    }
    // return `${year}-${month}-${day}`
}

function changeFormatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
   
       return `${day}/${month}/${year}`;    
  }


if (document.querySelector('#ticket_comments') != undefined)
{
    document.querySelector('#ticket_comments').addEventListener('focus', (event) => {
        document.querySelector('#ticket_comments').style.borderColor = '#dadfe5';
    });
}

if (document.querySelector('#addComment') != undefined)
{
    document.querySelector('#addComment').addEventListener('click', (event) => {
        if (document.querySelector('#ticket_comments').value.trim() != '')
        {
            if (confirm("Are you sure you want to add the comment ?") == true) {
                const ticketId = document.querySelector('#ticketId').value;
                client.post('/tickets/addComments/' + ticketId, JSON.stringify({'note' : document.querySelector('#ticket_comments').value}), (response, request) => {
                    location.reload();
                });
            }   
        } else {
            document.querySelector('#ticket_comments').style.borderColor = 'red';
        }
    }); 
}

if (document.querySelectorAll('.table-sort') != undefined)
{
    document.querySelectorAll('.table-sort').forEach((element) => {
        element.addEventListener('click', (event) => {
            document.querySelector('#sortField').value = event.target.getAttribute('data-fieldname')
            if(document.querySelector('#sortBy').value == 'DESC')
            {
                document.querySelector('#sortBy').value = 'ASC';
            } else {
                document.querySelector('#sortBy').value = 'DESC';
            }
            document.querySelector('#ticket_form').submit();
        });
    });
}

if(document.querySelector("#datepicker-icon-prepend") != undefined){
document.addEventListener("DOMContentLoaded", function () {
    if (window.Litepicker) {
        var calender_ele = new Litepicker({
            element: document.getElementById('datepicker-icon-prepend'),
            tooltipText: {
                one: 'day',
                other: 'days'
            },
            dropdowns: {
                months: true,
            },
            tooltipNumber: (totalDays) => {
                return totalDays;
            },
            buttonText: {
                previousMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="15 6 9 12 15 18" /></svg>`,
                nextMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="9 6 15 12 9 18" /></svg>`,
            },
            singleMode: false,
            numberOfMonths: 2,
            numberOfColumns: 2,
            selectForward: true,
            selectBackward: false,
            format: 'DD.MM.YYYY',
            maxDate: new Date(),
            startDate: new Date(),
            firstDay: 1,
        })
        calender_ele.render()
    }
});
}

if (document.querySelector('#filter_date_range') != undefined)
{
    document.querySelector('#filter_date_range').addEventListener('change', (event) => {
        let filter_date_range = event.target.value;
        document.querySelector('.filter_date').value = '';
    
        if(filter_date_range === 'today') {
            document.querySelector('.filter_date').value = get_today_date() + ' - ' + get_today_date();
        } else if(filter_date_range === 'yesterday') {
            document.querySelector('.filter_date').value = get_past_date(2) + ' - ' + get_past_date(2);
        } else if(filter_date_range === 'last_7_days') {
            document.querySelector('.filter_date').value = get_past_date(7) + ' - ' + get_today_date();
        } else if(filter_date_range === 'this_week') {
            document.querySelector('.filter_date').value = get_last_monday() + ' - ' + get_today_date();
        } else if(filter_date_range === 'this_month') {
            document.querySelector('.filter_date').value = get_first_day_in_month() + ' - ' + get_today_date();
        } else if(filter_date_range === 'custom') {
    
        }
    });
}

if (document.querySelector('#email') != undefined)
{
    document.querySelector('#email').addEventListener('click', (event) => {
        document.querySelector('#email').classList.remove('is-invalid');
        document.querySelector('#email_error').innerHTML = '';
        document.querySelector('#email_error').style.display = 'none';
    });
}

if (document.querySelectorAll('.ticket-ca-block') != undefined)
{
    document.querySelectorAll('.ticket-ca-block').forEach((element) => {
        if (window.location.href.includes('tabs-activity'))
        {
            document.querySelectorAll('.ticket-comments-field').forEach((element) => {
                element.classList.add('hideblock');
            });

            document.querySelectorAll('.ticket-activity-field').forEach((element) => {
                element.classList.remove('hideblock');
            });
        }
        element.addEventListener('click', (event) => {
            var tab_type = event.target.parentNode.getAttribute('data-tab-type');
            if (tab_type == 'activity')
            {
                document.querySelectorAll('.ticket-comments-field').forEach((element) => {
                    element.classList.add('hideblock');
                });

                document.querySelectorAll('.ticket-activity-field').forEach((element) => {
                    element.classList.remove('hideblock');
                });

            } else {
                document.querySelectorAll('.ticket-comments-field').forEach((element) => {
                    element.classList.remove('hideblock');
                });

                document.querySelectorAll('.ticket-activity-field').forEach((element) => {
                    element.classList.add('hideblock');
                });
            }
            
        });
    });
}

if (document.querySelector('#show-password') != undefined)
{
    document.querySelector('#show-password').addEventListener('click', (event) => {
        if (document.querySelector('#password').type == 'password')
        {
            document.querySelector('#password').type = 'text';
        } else {
            document.querySelector('#password').type = 'password';
        }
    });
}


function get_last_monday() {
    d = new Date();
    dy = 1;
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:dy); // adjust when day is sunday
    return new Date(d.setDate(diff)).toLocaleDateString('fr-CH')
}
function get_first_day_in_month() {
    date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('fr-CH')
}

const get_today_date = () => {
   return new Date().toLocaleDateString('fr-CH')
};
const get_past_date = (no_of_day) => {
    var date = new Date();
    date.setDate(date.getDate() - (no_of_day - 1));
    return new Date(date.toDateString()).toLocaleDateString('fr-CH')
};

function showErrorMessage(response)
{
    document.querySelector('#' + response.field).classList.add('is-invalid');
    document.querySelector('#' + response.field + '_error').innerHTML = response.message;
    document.querySelector('#' + response.field + '_error').style.display = 'block';
}

function sort_select_dropdown(id) {
    var dorpdown = $('#' + id);
    dorpdown.html(dorpdown.find('option').sort(function (option1, option2) {
    return $(option1).text() < $(option2).text() ? -1 : 1;
    }));
}

$( document ).ready(function() { 
    sort_select_dropdown("application");
    sort_select_dropdown("list_assignees");
    sort_select_dropdown("server");
    sort_select_dropdown("list_status");
    sort_select_dropdown("list_priority");
});

//Lockout process

let lastActivityTimestamp;

const updateLastActivity = () =>{
    lastActivityTimestamp = Date.now()
}

setInterval(()=>{
  const currentTime = Date.now()
  const inActiveTime = currentTime - lastActivityTimestamp
  const currentUrl = window.location.href

  if(inActiveTime >= 10 * 60 * 1000){
  client.post("/accountLock/lock",JSON.stringify({"userInActive":true,"url":currentUrl}),(req,res)=>{
    if(res.status == 200){
     window.location.href = "/accountLock"
}  
})

  }
}, 10000)
 
window.addEventListener("DOMContentLoaded",updateLastActivity)
window.addEventListener("mousemove",updateLastActivity)
window.addEventListener("keydown",updateLastActivity)
window.addEventListener("wheel",updateLastActivity)

