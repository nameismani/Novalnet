
// session timer
$(document).ready(() => {
    let expirytime = $('#session_time').val()
    let session_time = $('#session_time').val()
    // $('#clock').removeClass('first_animate')  
    function sendCode(countDownTarget) {

        var x = setInterval(function () {

            showClock(countDownTarget);

            if (countDownTarget - new Date().getTime() < 0) {
                clearInterval(x);
                // location.href = '/logout'
                $('#session-modal').show()
                $.ajax({
                    method:"POST",
                    url:"/session_time",
                    data:"30"
                 })
                 .then((data)=>{
                    if(data.status == 100){
                        console.log(data.status_desc);
                    }
                 })

            }

        }, 1000);

        function showClock(target) {

            const distance = target - new Date().getTime();

            const hours = distance < 0 ? 0 : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = distance < 0 ? 0 : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const second = distance < 0 ? 0 : Math.floor((distance % (1000 * 60)) / 1000);
            $('#clock').addClass('timer_effect')
            setTimeout(() => {
                $('#clock').removeClass('timer_effect')

            }, 1000)
            if (hours == 0 && mins <= 10) {
                $('#clock').addClass('bg-danger').removeClass('bg-primary')
                $('.timer_div').addClass('border-danger').removeClass('border-primary')
                $('#timer_text').addClass('text-danger').removeClass('text-primary')


            }
            else {

                $('#clock').addClass('bg-primary').removeClass('bg-danger')
                $('.timer_div').addClass('border-primary').removeClass('border-danger')
                $('#timer_text').addClass('text-primary').removeClass('text-danger')


            }

            $('#session_hours').html(`${(String(hours).length == 1 ? `0${hours}` : hours)}:`)
            $('#session_mins').html(`${(String(mins).length == 1 ? `0${mins}` : mins)}:`)
            $('#session_seconds').html(`${(String(second).length == 1 ? `0${second}` : second)}`)


        }
    }

    sendCode(session_time)

    // session extend modal click cancel
    $(document).on('click','.session_logout_btn',()=>{
        location.href='/logout'
     })

    setTimeout(() => {
        $('.timer_div').animate({
            width: '180px',

        }, 200, 'linear')
        $('#timer_text').addClass('text_opacity')
        $('#close_timer').addClass('opacity_timer')
        // setTimeout(()=>{
        // $('#close_timer').removeClass('opacity_timer')
        // $('#timer_text').removeClass('text_opacity')
        //     $('.timer_div').animate({
        //     width: '65px',

        // },200,'linear')
        // $('#clock').addClass('show_timer')
        // },3000)
    }, 2000)
});
$("#session_extend_password").on('keyup',function (e) {
    
    $('#session_pass_err').hide()
   
    if ($('#session_extend_password').val() != '') {
        $('#session_extend_password').removeClass('error_border');
        $('#session_extend_password').removeClass("is-invalid");
    }
    if (e.which == 13) {
        if ($('#session_extend_password').val() != '') {
            e.preventDefault();
            $('#session_extend_confirm').click();
        } else {
        $('#session_extend_password').addClass('error_border');

            e.preventDefault();
            return false;
        }
    }
});

const password_valid =()=>{
    if(!$('#session_extend_password').val()){
        $('#session_extend_password').addClass('error_border');
        return false
    }else if($('#session_extend_password').val().length < 8){
        $('#session_extend_password').addClass('error_border');
        $('#session_pass_err').text('Password Must Be AlphaNumeric 8 Characters').show()
        return false
    }
   
        return true
   
}

// session extend modal confirm click function
$(document).on('click','#session_extend_confirm',()=>{
    if(password_valid()){
        $.ajax({
        method:"POST",
        url:"/extend_session",
        data:{password:$('#session_extend_password').val(),time:"1h"}
    })
  
    .then((res)=>{
        if(res.status == 100){
            console.log('status',res);
            location.reload()
        }
        else if(res.status == 103){
        $('#session_pass_err').text(res.status_desc).show()
           
        }
    })
    }

 })

$(document).on('click', '#clock', () => {
    $('#clock').addClass('boom')

    if ($('#close_timer').hasClass('opacity_timer')) {
        $('.timer_div').animate({
            width: '54px',

        }, 200, 'linear')
        $('#timer_text').removeClass('text_opacity')
        $('#close_timer').removeClass('opacity_timer')

    } else {
        $('.timer_div').animate({
            width: '180px',
            opacity: 1
        }, 200, 'linear')
        $('#timer_text').addClass('text_opacity')
        $('#close_timer').addClass('opacity_timer')


    }
    setTimeout(() => {
        $('#clock').removeClass('boom')

    }, 500)

})

$(document).on('click', '#close_timer', () => {
    $('.timer_div').animate({
        width: '75px',
    }, 200, 'linear')
    $('#timer_text').removeClass('text_opacity')
    $('#close_timer').removeClass('opacity_timer')
})
// session timer end

// widget list lock
const widgetlist_lock = (chart_src) => {

    $('.list_widget').find('.subElement').each((ind, ele) => {
        let element_chartsrc = $(ele).attr('data-chart-src')
        if (element_chartsrc && chart_src == element_chartsrc) {
            if (!$(ele).hasClass('drag_start_events')) {
                $(ele).attr('draggable', true)
                $(ele).children().addClass('zoom-in')
                $(ele).find('.widget_lock').css('display', 'none')

            } else {
                $(ele).attr('draggable', false)
                $(ele).children().removeClass('zoom-in')
                $(ele).find('.widget_lock').css('display', 'block')

            }
            $(ele).toggleClass('drag_start_events')

            $(ele).children().toggleClass('cursor_blocked')
        }
    })
}
// end

let emailRegex = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;
$('#email').keyup(() => emailvalid('#email'))

function emailvalid(fieldName) {
    let email = $(fieldName);
    if (!email.value.match(emailRegex) && !email.value.length == 0) {
        email.css('border', '1px solid red')
        return false;
    }
    else {
        email.removeAttr('style')
        return true;
    }
}


//widget search
$(".widgetsearch").on("keyup", function () {
    var value = this.value.toLowerCase().trim();
    let flag = false;
    $(".subElement").show().filter(function () {
        if ($(this).text().toLowerCase().trim().includes(value)) {
            flag = true;
        }
        return $(this).text().toLowerCase().trim().indexOf(value) == -1;
    }).hide();

    if (!flag) {
        $('.list_widget .widgetnotFound').show();

    } else {
        $(".list_widget .widgetnotFound").hide();
    }
});

//set value two widget search box
$('#widgetsearch').keyup(function () {
    $('#widgetsearch1').val($(this).val());
});
$('#widgetsearch1').keyup(function () {
    $('#widgetsearch').val($(this).val());
});

//loading widget animation 
$('.real_widget').hide();
setTimeout(() => {
    $('#dup_widget').fadeOut();
    $('.real_widget').show();
    $('#dup_widget').remove();
}, 3000)

// clone row click function
$(document).on('click', '.clone_row', function () {
    let parent = $(this).parent().parent().find('.custom_col');
    if (parent.length == 1) {
        $('<div class="intro-y mt-5 custom_row"> <div class="row_action"><span  data-te-toggle="tooltip" title="Clone" class="clone_row"><svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span><span data-te-toggle="tooltip" title="Delete"  class="delete_row"><img alt="delete" src="/images/del.svg" class="w-3"></span> </div> <div class="grid grid-cols-12 gap-6"> <div class="col-span-12 lg:col-span-12 custom_col"> <div class="box h-[320px] p-5 drop_container"> <div class="border-dashed h-full drag_events_receive"> <p class="text-center">Drag and Drop the widgets</p> </div> </div> </div> </div> </div>').insertAfter($(this).parent().parent());
    } else if (parent.length == 2) {
        $('<div class="intro-y mt-5 custom_row"><div class="row_action"><span  data-te-toggle="tooltip" title="Clone" class="clone_row"><svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span><span data-te-toggle="tooltip" title="Delete"  class="delete_row"><img alt="delete" src="/images/del.svg" class="w-3"></span></div><div class="grid grid-cols-12 gap-6"><div class="col-span-12 lg:col-span-6 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-6 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div></div></div>').insertAfter($(this).parent().parent());
    } else if (parent.length  == 3) {
        $('<div class="intro-y mt-5 custom_row"><div class="row_action"><span  data-te-toggle="tooltip" title="Clone" class="clone_row"><svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span><span data-te-toggle="tooltip" title="Delete"  class="delete_row"><img alt="delete" src="/images/del.svg" class="w-3"></span></div><div class="grid grid-cols-12 gap-6"><div class="col-span-12 lg:col-span-4 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-4 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-4 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div></div></div>').insertAfter($(this).parent().parent());
    } else if (parent.length  == 4) {
        $('<div class="intro-y mt-5 custom_row"><div class="row_action"><span  data-te-toggle="tooltip" title="Clone" class="clone_row"><svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span><span data-te-toggle="tooltip" title="Delete"  class="delete_row"><img alt="delete" src="/images/del.svg" class="w-3"></span></div><div class="grid grid-cols-12 gap-6"><div class="col-span-12 lg:col-span-3 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-3 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-3 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-3 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div></div></div>').insertAfter($(this).parent().parent());
    }
    $('html, body').animate({
        scrollTop: $(this).offset().top - 50
    }, "slow");

});

// warning snd success slider notification remove function
function notify_slider(modal_name, txt_ele, notify_txt, action = 0) {
    if (action) {
        $('#redirect_action').val(action);
        setTimeout(() => {
            $(txt_ele).html(notify_txt);
            $(modal_name).show();
        }, 500);
    } else {
        $(txt_ele).html(notify_txt);
        $(modal_name).show();
    }

}

//before save find widgets repeating or not
function widgets_validate(dashboard_data) {
    if (dashboard_data.widget_ids.length < 1) {
        notify_slider('#warn_modal', '#warn-msg', 'Can\'t Save Empty Dashboard');
        return false;
    }
    else {
        if (dashboard_data.widgets_dup.length !== new Set(dashboard_data.widgets_dup).size) {
            notify_slider('#warn_modal', '#warn-msg', 'Don\'t Place Same Widget More Than One');
            let widgets_dup = dashboard_data.widgets_dup;
            const check_duplicate_in_array = (input_array) => {
                const duplicates = input_array.filter((item, index) => input_array.indexOf(item) !== index);
                return Array.from(new Set(duplicates));
            }
            widgets_dup = check_duplicate_in_array(widgets_dup);
            $('.chart').each((index, el) => {
                if (widgets_dup.includes(Number($(el).attr('data-chart-src')))) {
                    $(el).parent().parent().css("border", "1px solid red");
                }
            })
            return false;
        }
        return true;
    }

}

// get custom dashboard structure and necessary values and return JSON format of dashboard structure
const getDashboard_Structure = () => {
    let custom_dashboard = {};
    let widget_ids = [];
    let widgets_dup = [];
    let widget_filled = true;
    let custom_dashboard_name = String($('#dashboard_name').val()).trim();
    if (custom_dashboard_name.length) {
        custom_dashboard.name = custom_dashboard_name.charAt(0).toUpperCase() + custom_dashboard_name.slice(1);
        $('#custom_dashboard_view').find('.custom_row').each((i, ele) => {
            widget_ids = [...widget_ids, { "custom_col": [] }]
            $(ele).find('.custom_col').each((inn, ell) => {
                if ($(ell).find('.chart').attr('data-chart-src') !== undefined) {
                    let chart_id = Number($(ell).find('.chart').attr('data-chart-src'))
                    widget_ids[i].custom_col.push(chart_id);
                    widgets_dup.push(chart_id);
                } else {
                    widget_filled = false;
                    notify_slider('#warn_modal', '#warn-msg', 'Please Fill Empty Widget Field');

                    return false;
                }
            })
        });

    } else {
        notify_slider('#warn_modal', '#warn-msg', 'Please Enter The Dashboard Name');
        return false;
    }
    custom_dashboard.widget_ids = widget_ids;
    custom_dashboard.active = true;
    return { custom_dashboard, widget_filled, widget_ids, widgets_dup };
}


// save custom dashboard 
$(document).on('click', '#save_dashboard', () => {
    let dashboard_Sructure = getDashboard_Structure();
    if (dashboard_Sructure.widget_filled && widgets_validate(dashboard_Sructure)) {
        fetch('/new_dashboard', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dashboard_Sructure.custom_dashboard)
        }).then(res => res.json()).then((res) => {
            if (res.status == 100) {
                notify_slider('#success_modal', '#success-msg', res.status_desc, `/dashboard/${res.redirect}`);
            }
            else if(res.status == 104){
                location.reload()
            } 
            else {
                notify_slider('#warn_modal', '#warn-msg', res.status_desc);

            }
        }).catch((error) => console.log(error));
    }

});

// edit dashboard page routing 
$('#edit_dashboard_btn').click(() => {
    let dashboard_id = String(window.location.href).split('/');
    dashboard_id = dashboard_id[dashboard_id.length - 1];
    location.href = `/edit_dashboard/${dashboard_id}`;
});

//click event for delete confirm dashboard
$('#confirm_dashboard_delete').on('click', (e) => {
    $('#delete_dashboard').hide()
    let delete_id = $(e.target).attr('data-list-id')
    $.ajax({
        method: "DELETE",
        url: `/delete_dashboard`,
        data: { dashboard: delete_id }
    }).done(function (res) {
        if (res.status == 100) {
            notify_slider('#success_modal', '#success-msg', `Dashboard "${res.dashboard_name}" Deleted Successfully`, "reload");
        }
        else if(res.status == 104){
            location.reload()
        }
    });
})

//delete confirm modal close
$('.cancel_dashboard_delete').on('click', () => {
    $('#delete_dashboard').hide()
});

// delete dashboard routing
$(".delete_dashboard").click((e) => {
    let id = $(e.target).attr('data-list-id')
    let dash_name = $(e.target).attr('data-dash-name')
    $('#dash_name').html(`"${dash_name}"`)
    $('#confirm_dashboard_delete').attr('data-list-id', id)
    $('#delete_dashboard').show()

})

// save edited custom dashboard format
$(document).on('click', '#save_edit_dashboard', () => {
    let dashboard_id = String(window.location.href).split('/');
    dashboard_id = dashboard_id[dashboard_id.length - 1];
    let dashboard_Sructure = getDashboard_Structure();
    dashboard_Sructure.custom_dashboard.id = dashboard_id;
    if (dashboard_Sructure.widget_filled && widgets_validate(dashboard_Sructure)) {
        $.ajax({
            method: "PUT",
            url: `/edit_dashboard`,
            data: { dashboard: dashboard_Sructure.custom_dashboard }
        }).done(function (res) {
            if (res.status == 100) {
                notify_slider('#success_modal', '#success-msg', 'Dashboard Changed Successfully.', `/dashboard/${res.redirect}`);
            }
            else if(res.status == 104){
                location.reload()
            }
        });
    }
});


// add empty row and columns
$(document).ready(function () {
    $(".dashborad-grid-type").on("click", function () {
        if ($(this).attr("data-display-column") == 1) {
            $("#custom_dashboard_view").append('<div class="intro-y mt-5 custom_row"> <div class="row_action"><span  data-te-toggle="tooltip" title="Clone" class="clone_row"><svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span><span data-te-toggle="tooltip" title="Delete"  class="delete_row"><img alt="delete" src="/images/del.svg" class="w-3"></span> </div> <div class="grid grid-cols-12 gap-6"> <div class="col-span-12 lg:col-span-12 custom_col"> <div class="box h-[320px] p-5 drop_container"> <div class="border-dashed h-full drag_events_receive"> <p class="text-center">Drag and Drop the widgets</p> </div> </div> </div> </div> </div>');
        } else if ($(this).attr("data-display-column") == 2) {
            $("#custom_dashboard_view").append('<div class="intro-y mt-5 custom_row"><div class="row_action"><span  data-te-toggle="tooltip" title="Clone" class="clone_row"><svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span><span data-te-toggle="tooltip" title="Delete"  class="delete_row"><img alt="delete" src="/images/del.svg" class="w-3"></span></div><div class="grid grid-cols-12 gap-6"><div class="col-span-12 lg:col-span-6 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-6 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div></div></div>');
        } else if ($(this).attr("data-display-column") == 3) {
            $("#custom_dashboard_view").append('<div class="intro-y mt-5 custom_row"><div class="row_action"><span  data-te-toggle="tooltip" title="Clone" class="clone_row"><svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span><span data-te-toggle="tooltip" title="Delete"  class="delete_row"><img alt="delete" src="/images/del.svg" class="w-3"></span></div><div class="grid grid-cols-12 gap-6"><div class="col-span-12 lg:col-span-4 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-4 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-4 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div></div></div>');
        } else if ($(this).attr("data-display-column") == 4) {
            $("#custom_dashboard_view").append('<div class="intro-y mt-5 custom_row"><div class="row_action"><span  data-te-toggle="tooltip" title="Clone" class="clone_row"><svg class="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></span><span data-te-toggle="tooltip" title="Delete"  class="delete_row"><img alt="delete" src="/images/del.svg" class="w-3"></span></div><div class="grid grid-cols-12 gap-6"><div class="col-span-12 lg:col-span-3 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-3 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-3 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div><div class="col-span-12 lg:col-span-3 custom_col"><div class="box h-[320px] p-5 drop_container"><div class="border-dashed h-full drag_events_receive"><p class="text-center">Drag and Drop the widgets</p></div></div></div></div></div>');
        }
        //window scroll 
        $('html, body').animate({
            scrollTop: $(this).offset().top - 350
        }, "slow");
    });
});

let drag_start = false;
var img_src = ''

// delete row event
$(document).on('click', '.row_action .delete_row', function () {
    $(this).parent().parent().find('.drag_events_receive').each((index,ele)=>{
        let chart_src=$(ele).find('.chart').attr('data-chart-src')
     if(chart_src){
        widgetlist_lock(chart_src);
     }
    })
    $(this).parent().parent().remove();
});

// dragover event
$(document).on('dragover', '.drag_events_receive', (ev) => {
    ev.preventDefault();
    if (ev.target.tagName == 'P' && drag_start) {
        $(ev.target).addClass('border-color')
    }
});

// dragleave event
$(document).on('dragleave', '.drag_events_receive', (ev) => {
    $(ev.target)?.removeClass('border-color')
    $(ev.target)?.children()?.removeClass('border-color');
    img_src = ''
})

// dragend event
$(document).on('dragend', '.drag_start_events, .drag_events_receive', (ev) => {
    img_src = ''
    drag_start = false
    $('p').removeClass('border-color')
});

// dragstart event
$(document).on('dragstart', '.drag_start_events', (ev) => {
    drag_start = true
    ev.originalEvent.dataTransfer.setData("text", ev.target.getAttribute('data-img-src'));
    ev.originalEvent.dataTransfer.setData("chart", ev.target.getAttribute('data-chart-src'));
    ev.originalEvent.dataTransfer.setData("width", ev.target.getAttribute('data-width-attr'))
});

// dragenter event
$(document).on('dragenter', '.drag_events_receive', (ev) => {
    ev.preventDefault();
    let event_src = $(event.target).attr('src')
    if (event_src) {
        img_src = event_src
    }


});

//goto previous URL page
const preurl = () => {
    let previousUrl = [];
    $.ajax({
        url: "/previous",
        type: "GET",
        success: (res) => {
            window.location.href = res.previousUrl
        }
    })
}

//Remove duplicates error border in create and edit dashboard page
const remove_border = (event) => {
    let widgetid = $(event).attr('data-chart-src');
    if ($(`.chart[data-chart-src=${widgetid}]`).length == 2) {
        $(`.chart[data-chart-src=${widgetid}]`).each((index, el) => {
            $(el).parent().parent().removeAttr("style");
        })
    }
    else if ($(`.chart[data-chart-src=${widgetid}]`).length > 2) {
        $(event).parent().parent().removeAttr("style");
    }
}

//Confirmation accept button for replace widget
$('#accept_replace').on('click', () => {
    remove_border('#newid');
    let chart_src = ($('#hidden_event').children().attr('data-chart-src'));
    widgetlist_lock(chart_src)
    let old_chart_src = $('#newid').attr('data-chart-src')
    widgetlist_lock(old_chart_src)

    $('#newid').parent().append($('#hidden_event').children())
    $('#newid').remove()
    $('#replace-modal').hide();

});

//cancel button for replace widget
$('.cancel_replace').on('click', () => {
    $('#replace-modal').hide()
    $('#newid').removeAttr('id')
})

// function for widget images append
const widget_append = (event, img, chart_src) => {
    if (event.target.tagName == 'P') {
        widgetlist_lock(chart_src)
        $(event.target).parent().append('<img data-te-toggle="tooltip" title="Remove" class="remove_image" src="/images/trash.svg" >')
        $(event.target).parent().append(img)
        event.target.remove()
    }
    else {
        let parent = $(event.target).attr('id', 'newid')
        $('#hidden_event').attr('data-attr', event.target)
        $('#hidden_event').html(img)
        $('#replace-modal').show()
    }
}


// widget drop event
$(document).on('drop', '.drag_events_receive', (event) => {
    event.preventDefault();
    var fetchData = event.originalEvent.dataTransfer.getData("text");
    let required_width = event.originalEvent.dataTransfer.getData('width')
    let chart_src = event.originalEvent.dataTransfer.getData('chart')

    if (required_width == '') {
        $('p').removeClass('border-color')
        return
    }
    if (img_src == fetchData) {
        return
    }

    if (!fetchData.toLowerCase().includes('https')) {
        let img = document.createElement('img');


        $(img).attr({
            'src': fetchData,
            'class': 'chart w-full h-full',
            'data-chart-src': chart_src
        });

        let span_width = $(event.target).parentsUntil('div .drop_container').parent().parent().attr('class')

        if ($(event.target).hasClass('remove_image')) { }
        else {
            if (span_width.includes('lg:col-span-12') && required_width.includes('12')) {
                widget_append(event, img, chart_src);
            }
            else if (span_width.includes('span-6') && required_width.includes('6')) {
                widget_append(event, img, chart_src);
            }
            else if (span_width.includes('span-4') && required_width.includes('4')) {
                widget_append(event, img, chart_src);
            }
            else if (span_width.includes('span-3') && required_width.includes('3')) {
                widget_append(event, img, chart_src);
            }
            else {
                notify_slider('#warn_modal', '#warn-msg', 'The Widget Not fit in this card, Try another card');

                return
            }
        }

    }
});

//close widget list in create and edit dashboard page 
$(document).on('click', '#close-widget', function () {
    $('.displayToogle').hide()
    $('#close-widget').hide()
    $('#widget').animate({
        width: '60px'
    }, 50, 'linear')
    $('.searchDisplay').show(300)
});

//open widget list in create and edit dashboard page 
$(document).on('click', '#setting , .drag_events_receive', () => {
    $('#widget').animate({
        width: '260px'
    }, 50, 'linear')

    $('.displayToogle').fadeIn(300)
    $('.searchDisplay').fadeOut(200)
    $('#close-widget').fadeIn(300)
})

// when click remove widget button event
$(document).on('click', '.remove_image', function () {
    let temp = $(this).siblings();
    let chart_src = $(this).siblings().attr('data-chart-src')
    remove_border(temp);
    widgetlist_lock(chart_src)
    $(this).parent().html('<p  class="text-center">Drag and Drop the widgets</p>');
})


//preview for widget list in create and edit dashboard page 
$(document).on('click', '#preview', function (e) {
    let preview_content = $('#custom_dashboard_view').html()
    preview_content = $(preview_content).each((ind, el) => {
        $(el).find('div.row_action').remove()
        $(el).find('.drag_events_receive').find('img.remove_image').remove()
        $(el).find('.drag_events_receive').find('p').remove()
        $(el).find('.drop_container').removeClass('p-5')
        $(el).find('.drag_events_receive').removeClass('drag_events_receive')
    });
    $('#preview-content').html($(preview_content))
});

// create and edit dashboard back button confirmation modal
$('#backbtn').on('click', () => {
    $('#confirm-modal').show();
});


//after success modal message reload or redirect page based on event
$(document).on('click', '.backbtn_cancel', () => {
    let action = $('#redirect_action').val()
    $('.show_successmodal').hide();
    if (action != 0) {
        if (action == "reload") {
            location.reload();
        } else {
            location.href = action
        }
    }
});


//back button in create and edit dashboard page 
$(document).on('click', '#confirm', () => {
    preurl()
});

//change password fields validation function
let PassRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/
function validateForm() {
    var NewPass = $("#NewPass").val();
    var oldPass = $("#oldPass").val();
    var ConfirmNewPass = $("#ConfirmNewPass").val();
    if (NewPass === "" || ConfirmNewPass === "" || oldPass === "") {
        if (oldPass == '') { $('#oldPass').css('border', '1px solid red'); $('#curPass_err').text('Field was Empty') } else { $('#oldPass').removeAttr('style'); $('#curPass_err').text(''); }
        if (NewPass == '') { $('#NewPass').css('border', '1px solid red'); $('#newPass_err').text('Field was Empty') } else { $('#NewPass').removeAttr('style'); $('#newPass_err').text(''); }
        if (ConfirmNewPass == '') { $('#ConfirmNewPass').css('border', '1px solid red'); $('#confirmPass_err').text('Field was Empty') } else { $('#ConfirmNewPass').removeAttr('style'); $('#confirmPass_err').text(''); }
        return false;
    }
    if (!PassRegex.test(NewPass)) {
        $('#NewPass').css('border', '1px solid red');
        $('#newPass_err').text('Password Must Be AlphaNumeric 8 Characters')
        return false;
    }
    return true;
}
function checkequal() {
    var NewPass = $("#NewPass").val();
    var ConfirmNewPass = $("#ConfirmNewPass").val();
    if (NewPass !== ConfirmNewPass) {
        $('#ConfirmNewPass').css('border', '1px solid red');
        $('#confirmPass_err').text('New password and Confirm password doesn\'t match');
        return false;

    }
    else {
        $('#ConfirmNewPass').removeAttr('style');
        $('#confirmPass_err').text('');

        return true;
    }

}
$('#oldPass').keyup(() => { if ($('#oldPass') !== '') { $('#oldPass').removeAttr('style'); $('#curPass_err').text(''); } })
$('#NewPass').keyup(() => { if (PassRegex.test($("#NewPass").val())) { $('#NewPass').removeAttr('style'); $('#newPass_err').text(''); } })
$("#ConfirmNewPass").keyup(() => checkequal())
$("#ConfirmNewPass").on('keyup', () => validateForm());


// password show or hide using eye button toggle
$(".eye").toggle();
function Pass_Toggle(eye, eye_off, password_field) {
    if ($(`#${password_field}`).attr("type") !== 'password') {
        $(`#${eye}`).hide();
        $(`#${eye_off}`).show();
        $(`#${password_field}`).attr("type", "password");
    } else {
        $(`#${eye}`).show();
        $(`#${eye_off}`).hide();
        $(`#${password_field}`).attr("type", "text");
    }

}

// let password = document.getElementById("password");
let password_indicator = $('.password-indicator').children();
let passwordStrength = document.getElementById("password-strength");
$('#NewPass').keyup(() => {
    let pass = $('#NewPass').val();
    checkStrength(pass);

})


// check passowrd strenth and regex validation
function checkStrength(password) {
    let strength = 0;
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
        strength += 1;
    }
    if (password.match(/([0-9])/)) {
        strength += 1;
    }
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
        strength += 1;
    }
    if (password.length > 7) {
        strength += 1;
    }
    password_indicator.each((index, ele) => {
        $(ele).attr('class', 'h-full col-span-3 rounded bg-slate-200');
    });
    if (strength == 1) {
        $(password_indicator[0]).removeClass('bg-slate-200').addClass('bg-danger');
        return false;
    } if (strength == 2) {
        $(password_indicator[0]).removeClass('bg-slate-200').addClass('bg-warning');
        $(password_indicator[1]).removeClass('bg-slate-200').addClass('bg-warning');
        return false;
    }
    else if (strength == 3) {
        $(password_indicator[0]).removeClass('bg-slate-200').addClass('bg-primary');
        $(password_indicator[1]).removeClass('bg-slate-200').addClass('bg-primary');
        $(password_indicator[2]).removeClass('bg-slate-200').addClass('bg-primary');
        return false

    } else if (strength == 4) {
        $(password_indicator[0]).removeClass('bg-slate-200').addClass('bg-success');
        $(password_indicator[1]).removeClass('bg-slate-200').addClass('bg-success');
        $(password_indicator[2]).removeClass('bg-slate-200').addClass('bg-success');
        $(password_indicator[3]).removeClass('bg-slate-200').addClass('bg-success');
        return true;

    } else if (strength == 0) {
        return false;
    }


}

//change password page ajax call
$('#changePassword').on('click', () => {
    let nn = jQuery.noConflict();
    if (checkStrength($('#NewPass').val())) {
        if (validateForm() && checkequal()) {
            nn.ajax({
                url: '/change_password',
                type: 'POST',
                data: {
                    // _token:$('#csrfToken').val(),
                    // email:$("#email").val(),
                    oldPassword: $("#oldPass").val(),
                    newPassword: $("#NewPass").val()
                },
                success: function (data) {


                    if (data.status == 100) {
                        notify_slider('#success_modal', '#success-msg', data.status_desc);
                        password_indicator.each((index, ele) => {
                            $(ele).attr('class', 'h-full col-span-3 rounded bg-slate-200');
                        });
                        $("#oldPass").val('');
                        $("#NewPass").val('');
                        $('#ConfirmNewPass').val('');
                    } else {

                        notify_slider('#warn_modal', '#warn-msg', data.status_desc);

                    }
                }, error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);

                }
            });
        }

    } else {
        $('#NewPass').css('border', '1px solid red');
        $('#newPass_err').text('Password Must Be AlphaNumeric 8 Characters');
        notify_slider('#warn_modal', '#warn-msg', 'Password Must Be AlphaNumeric 8 Characters');

    }
});

$('.back-url').on('click', () => {
    history.back()

});

// Api call for dashboard status change 
const dashboard_status_api = (status_id, status_value, success_text, status_text, e) => {

    $.ajax({
        method: "POST",
        url: `/dashboard_status`,
        data: { dashboard: status_id, status: status_value }
    }).done(function (res) {
        if (res.status == 100) {

            notify_slider('#success_modal', '#success-msg', success_text, "reload");
            $(e.target).parent().find('span').html(`<span class='${status_text == 'Active' ? 'text-success' : 'text-danger'} '>${status_text}</span>`)
        }
        else if(res.status == 104){
            location.reload()
        }
    }).always(() => {
        setTimeout(() => {
            $('.toggle').removeClass('cursor_progress')
            $('.toggle input').removeAttr('disabled')
        }, 3000)
    })
}

// Active or Inactive dashboard in Settings page
$('.dashboard_status').on('click', (e) => {
    $('.toggle input').attr('disabled', true)
    $('.toggle').addClass('cursor_progress')
    let status_id = $(e.target).attr('data-list-id')
    let dash_name = $(e.target).attr('data-dash-name')
    if ($(e.target).attr('data-status') == 'Inactive') {
        let status_text = $(e.target).attr('data-status', 'Active')
        dashboard_status_api(status_id, '1', `Dashboard "${dash_name}" Activated Successfully`, 'Active', e)
    } else {
        let status_text = $(e.target).attr('data-status', 'Inactive')
        dashboard_status_api(status_id, '0', `Dashboard "${dash_name}" InActiveted Successfully`, 'Inactive', e)
    }

})

$('.cancel_image_delete').on('click', () => {
    $('#delete_profile_image').hide()

})

$('#confirm_image_delete').on('click', () => {

    $('#preview_image').attr('src', '/images/default_image.avif')
    $('#remove-profile-image').hide()
    $('#delete_profile_image').hide()
})

$('#remove-profile-image').on('click', (e) => {
    e.preventDefault()
    $('#delete_profile_image').show()
})
const reset_profile_form = () => {
    $('#profile-name').removeClass('error_border')
    $('#profile-contact').removeClass('error_border')
    $('#profile-address').removeClass('error_border')


}
//user settings page validation function
const validate_profile_form = () => {
    reset_profile_form()
    var is_error_found = 0;
    if (!$('#profile-name').val()) {
        $('#profile-name').addClass('error_border');
        is_error_found = 1;
    }
    if (!$('#profile-contact').val()) {
        is_error_found = 1;
        $('#profile-contact').addClass('error_border');

    }
    if (!$('#profile-address').val()) {
        $('#profile-address').addClass('error_border');
        is_error_found = 1;
    }
    if (is_error_found === 1) {

        return false;
    }
    return true;
}
$('#profile_image').on('change', function (e) {
    // let binary_data = []
    let url = window.URL.createObjectURL(this.files[0])
    $('#remove-profile-image').show()
    $('#preview_image').attr('src', url)
    // binary_data.push(this.files[0])
    // console.log(binary_data);
    // if(!this.files[0]){
    // // $('#preview_image').attr('src','/images/default_image.avif')

    // }else{
    //     let url = window.URL.createObjectURL(new Blob(binary_data, {type: "application/zip"}))
    // //  var url = URL.createObjectURL(this.files[0]);
    // console.log(url);
    // $('#preview_image').attr('src',url)
    // }

});

//user setting page details 
$('#save_personal_details').on('click', () => {

    if (validate_profile_form()) {
        let profile_form = document.querySelector('#profile_form')
        let profile_image = document.getElementById('preview_image')
        var form_data = new FormData(profile_form)

        form_data.append('Email', $('#email').val())
        $.ajax({
            type: "PUT",
            url: `/update_profile`,
            headers: {
                "enctype": "multipart/form-data",
            },
            data: form_data,
            processData: false,
            contentType: false
        }).done((res) => {
            if (res.status == 100) {
                notify_slider('#success_modal', '#success-msg', res.status_desc);

                setTimeout(() => {
                    location.reload()
                }, 2000)
            }
            else if(res.status == 104){
                location.reload()
            }
        });
    }
})

//user settings profile-name field validation
$('#profile-name').on('keyup', (e) => {
    let value = $(e.target).val()
    if (!value) {
        $('#profile-name').addClass('error_border');

    } else {
        $('#profile-name').removeClass('error_border');

    }
});

//user settings profile-contact field validation
$('#profile-contact').on('keyup', (e) => {
    let value = $(e.target).val()
    var numReg = /^\d+$/;

    var number = $(e.target).val().replace(/\D/g, '');

    if (!numReg.test($(e.target).val())) {

        $(e.target).val(number)

    }
    if (!value) {
        $('#profile-contact').addClass('error_border');

    } else {
        $('#profile-contact').removeClass('error_border');

    }
})
//user settings profile-address field validation
$('#profile-address').on('keyup', (e) => {
    let value = $(e.target).val()


    if (!value) {
        $('#profile-address').addClass('error_border');

    } else {
        $('#profile-address').removeClass('error_border');

    }
})



// set default dashboard ajax call
const default_dashboard_api = (default_dash_id, status_value, success_text) => {
    $.ajax({
        method: "POST",
        url: `/set_default_dashboard`,
        data: { dashboard_id: default_dash_id, status: status_value }
    }).done(function (res) {
        if (res.status == 100) {
            console.log(res);
            notify_slider('#success_modal', '#success-msg', success_text, "reload");

        }
        else if(res.status == 104){
            location.reload()
        }

    }).always(() => {
        setTimeout(() => {
            $('.checkboxes').removeClass('cursor_progress')
            $('.checkboxes input').removeAttr('disabled')
        }, 1000)
    })
}

$(document).on('click', ".checkboxes input:checkbox", function () {

    var default_check = $(this);
    $('.checkboxes input').attr('disabled', true)
    $('.checkboxes').addClass('cursor_progress')
    if (default_check.is(":checked")) {
        let set_default_id = $(default_check).attr('id')

        var group = ".checkboxes input:checkbox[name='" + default_check.attr("name") + "']";
        $(group).prop("checked", false);
        default_check.prop("checked", true);
        default_dashboard_api(set_default_id, '1', `Set default dashboard is successfull`)
    } else {
        let remove_default_id = $(default_check).attr('id')
        default_check.prop("checked", false);
        default_dashboard_api(remove_default_id, '0', ` Default dashboard is removed successfully`)
    }
});










