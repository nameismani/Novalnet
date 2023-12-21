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

// if (tableRows != undefined)
// {
//     document.querySelectorAll('.ticket-rows').forEach((row) => {
//         row.addEventListener('click', (event) => {
//             var ticketId = event.target.parentElement.getAttribute('data-ticket-id');
//             if (ticketId != null && ticketId != undefined)
//             {
//                 window.location.href = `/tickets/detail/${ticketId}`
//             }

//         });
//     });

// }

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
            if (confirm("Are you sure you want to change the " + field + " ?") == true) {
                const ticketId = document.querySelector('#ticketId').value;
                var jsonData;
                if (field == 'status') { 
                    var jsonData = {'status' : document.querySelector('#' + field).value};
                } else if (field == 'assignees') {
                    var jsonData = {'assignees' : document.querySelector('#' + field).value};
                } else {
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

