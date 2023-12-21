function validateEmail(email) {
 const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
if(re.test(String(email).toLowerCase())){
    return true;
}
 $("#error_login_form").html("Invalid Email ID");
 $("#error_staff_login_block").show();
 return false;
}
$("#show_password").click(function () {
    var elem = document.getElementById("password");
    if (elem.type === "password") {
        elem.type = "text";
        $(this).attr('data-bs-original-title', 'Hide password');
    } else {
        elem.type = "password";
        $(this).attr('data-bs-original-title', 'Show password');
    }
});
$("#username, #password").keypress(function (e) {
    $("#error_login_form").html('');
    $("#error_staff_login_block").hide();
    if (e.which == 13) {
        $('#sign_in').click();
    }
    if ($(this).val() != '') {
        $(this).removeClass('error_border');
        /*if($(this).attr('id') == 'password') {
            $(this).removeClass('error_border');
            $("#password_input_group").removeClass('error_border');
        }*/
        $("#error_login_form").html('');
        $("#error_staff_login_block").hide();
    }
});

$("#portal_lang li").on('click', function () {
    let lang = $(this).attr("data-lang")
    var jqxhr = $.ajax("/lang/" + lang)
        .done(function () {
            location.reload();
        })
        .fail(function () {
            console.log("error");
        });
});
const disable = (btn_name, btn_text, loader, state = 0) => {
    if (state == '1') {
        $(btn_name).attr('disabled', true).addClass('cursor_progress');

        $(btn_text).addClass('display_none');
        $(loader).removeClass('display_none').addClass('display_inline')

    } else {
        $(btn_name).attr('disabled', false).removeClass('cursor_progress');
        $(btn_text).removeClass('display_none').addClass('display_inline');
        $(loader).addClass('display_none').removeClass('display_inline')
    }
}

$('#sign_in').click(function () {
    if (validate_login_form()) {
        disable('#sign_in', '#sign_text', '#loader', 1)
     
        $(this).addClass('btn-loading');
        var jqxhr = $.ajax({
            method: "POST",
            url: "/user/login",
            data: { email: $('#username').val(), password: $('#password').val() },
            headers:{'Authorization': $("#csrf").val()}
        })
            .done(function (data) {
                if (data.status === 100) {
                    location.href = data.redirect;
                    
                }
                else {
                    $("#error_login_form").html(data.status_desc);
                    $("#error_staff_login_block").show();
                    $("#csrf").val(data.csrf)
                }
            })
            .fail(function (msg) {
                console.log(msg);
            })
            .always(function () {
                disable('#sign_in', '#sign_text', '#loader')
                $('#sign_in').removeClass('btn-loading');

            });

    }
});

$('.digit-group').find('input').each(function () {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function (e) {
        var parent = $($(this).parent());
        $("#error_otp_verification").html('');
        if (!$("#error_otp_verification_block").hasClass('display_none')) {
            $("#error_otp_verification_block").addClass('display_none');
        }
        if (e.keyCode === 8 || e.keyCode === 37) {
            var prev = parent.find('input#' + $(this).data('previous'));

            if (prev.length) {
                $(prev).select();
            }
        } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
            var next = parent.find('input#' + $(this).data('next'));

            if (next.length) {
                $(next).select();
            } else {
                if (parent.data('autosubmit')) {
                    parent.submit();
                }
            }
        }
    });
});


$(".otp_digits_textbox").on("keyup", function (e) {

    var numReg = new RegExp('^[0-9]$');
    if (!numReg.test($(e.target).val())) {
        $(e.target).val('')
        $(e.target).focus()
    }
    if (e.keyCode == 8 || e.keyCode == 46) {
        $(e.target).val('')
        $(e.target).prev().focus()
    }
    if ($(this).val() != '') {
        if ($('#resend_code_success_block').length) {
            $('#resend_code_success_block').removeClass('display_block').addClass('display_none');
        }
    }
    $('#error_otp_verification_block').removeClass('display_block').addClass('display_none');
});



$(".otp_digits_textbox").on("paste", function (event) {
    const clipboardData = event.originalEvent.clipboardData || window.clipboardData;
    if (clipboardData) {
        const pastedText = clipboardData.getData('text').trim();
        const splittedOTP = pastedText.substring(0, 6).split("");
        const otpFieldids = ["#digit-1", "#digit-2", "#digit-3", "#digit-4"];
        let isValidOTP = true;

        if (isValidOTP) {
            event.preventDefault();
            for (let i = 0; i < otpFieldids.length; i++) {
                const element = $(`#otp-container ${otpFieldids[i]}`)
                if (element) {
                    element.val(splittedOTP[i]);
                }
            }
            $(`#otp-container ${otpFieldids[splittedOTP.length - 1]}`).select();
        }

        var numReg = new RegExp('^[0-9]$');
        otpFieldids.map((ele) => {
            if (!numReg.test($(ele).val())) {
                $(ele).val('')
            }
        })


    }


});

//   document.addEventListener('keypress',(e)=>{
//   if(e.key==='Enter' && location.pathname.includes("/otp_verify/")){
//     $('#otp_verify_submit').click();
//   }
//   if(e.key==='Enter' && location.pathname==="/"){
//     $('#sign_in').click()
//   }
// })

$('#otp_verify_submit').on('click', function (e) {
    $('.otp_digits_textbox').removeClass('error_border');
    if (!$('#digit-1').val()) { $('#digit-1').addClass('error_border'); }
    else if (!$('#digit-2').val()) { $('#digit-2').addClass('error_border'); }
    else if (!$('#digit-3').val()) { $('#digit-3').addClass('error_border'); }
    else if (!$('#digit-4').val()) { $('#digit-4').addClass('error_border'); }
    else {
        disable('#otp_verify_submit', '#verify_text', '#loader', 1)
        var otp = $('#digit-1').val() + $('#digit-2').val() + $('#digit-3').val() + $('#digit-4').val();
        var jqxhr = $.ajax({
            method: "POST",
            url: "/user/otp/verify",
            data: { token: $('#token').val(), otp: otp }
        })
            .done(function (data) {
                if (data.status === 100) {
                    location.href = data.redirect;
                } else {
                    $("#error_otp_verification").html(data.status_desc);
                    $('#error_otp_verification_block').addClass('display_block').removeClass('display_none');

                }

            })
            .fail(function (msg) {
                console.log(msg);
            })
            .always(function () {
                // $('#otp_verify_submit').removeClass('btn-loading');
                disable('#otp_verify_submit', '#verify_text', '#loader')
            });
    }
});

function validate_login_form() {
    reset_login_form();
    var is_error_found = 0;
    if (!$('#username').val()) {
        $('#username').addClass('error_border');
        is_error_found = 1;
    }

    if (!$('#password').val()) {
        is_error_found = 1;
        $('#password').addClass('error_border');
    }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       if(!(re.test(String($('#username').val()).toLowerCase()))){
        is_error_found = 1
        $("#error_login_form").html("Invalid Email ID");
        $("#error_staff_login_block").show();
        return false;
       }

    
    if (is_error_found === 1) {
        $('#is_error_found').val(1);
        return false;
    }
    return true;
}

function reset_login_form() {
    $('#is_error_found').val(0);
    $('#error_ls_form_block').hide();
    $('#username').removeClass('is-invalid');
    $('#password').removeClass('error_border');
    $('#password_input_group').removeClass('error_border');
    return true;
}

$('#unlock_account').click(function (e) {
    if (!$('#user_password').val()) {
        $('#user_password').addClass('error_border');
        e.preventDefault();
        return false;
    } else {
        $(this).addClass('btn-loading');
        var jqxhr = $.ajax({
            method: "POST",
            url: "/inactivity/dounlock",
            data: { password: $('#user_password').val() }
        })
            .done(function (data) {
                if (data.status === 100) {
                    location.href = data.redirect;
                } else {
                    $('#user_password').addClass("error_border");
                    $('#error_lockout_form_block').show();
                    $('#error_account_lock_form').html(data.status_desc);
                    
                }
            })
            .always(function () {
                $('#unlock_account').removeClass('btn-loading');
            });
    }
});

$("#user_password").keypress(function (e) {
    if ($('#user_password').val() != '') {
        $('#user_password').removeClass('error_border');
        $('#user_password').removeClass("is-invalid");
        $('#invalid-password-err-desc').html('');
        $('#error_lockout_form_block').hide();
        $('#error_account_lock_form').html('');
    }
    if (e.which == 13) {
        if ($('#user_password').val() != '') {
            e.preventDefault();
            $('#unlock_account').click();
        } else {
            e.preventDefault();
            return false;
        }
    }
});

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

function set_account_form_error(errormsg) {
    $('#error_account_lock_form').html(errormsg);
    $('#error_lockout_form_block').show();
    $('#user_password').addClass("error_border");
    return true;
}




    // warning snd success slider notification remove function
    function notify_slider(modal_name, txt_ele, notify_txt,) {
        $(txt_ele).html(notify_txt);
        $(modal_name).show();   
    }

    //modal close
    $(document).on('click', '.backbtn_cancel', () => {
        $('.show_successmodal').hide();
         
      });

// OTP attempt validation
let resend_code = false
$(document).ready(() => {


    let otp_time = $('#otp_time').val()


    function sendCode(countDownTarget) {

        var x = setInterval(function () {
            showClock(countDownTarget);
            if (countDownTarget - new Date().getTime() < 0) {
                clearInterval(x);
                $('#times').hide()
                $('#otp_resend_code').show()
            }

        }, 1000);
        function showClock(target) {
            const distance = target - new Date().getTime();
            const mins = distance < 0 ? 0 : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secs = distance < 0 ? 0 : Math.floor((distance % (1000 * 60)) / 1000);

            $('#minutes').html(`, ${(String(mins).length == 1 ? `0${mins}` : mins)}:`)
            $('#seconds').html(String(secs).length == 1 ? `0${secs}` : secs)
        }
    }

    sendCode(otp_time)

    $('#otp_resend_code').click(() => {

        $('#otp_resend_code').hide()
        $('.resend_loader').css('display', 'inline-block')
        $('#error_otp_verification_block').removeClass('display_block').addClass('display_none')
        $('#otp_verify_submit').addClass('btn-loading');
        $('#resend_code_success_block').removeClass('display_block').addClass('display_none');
        var jqxhr = $.ajax({
            method: "POST",
            url: "/user/otp/resend",
            data: { token: $('#token').val() }
        })
            .done(function (data) {
                if (data.status === 100) {
                             $('#resend_code_success_block').removeClass('display_none').addClass('display_block')
                    $('#my-alert').show()
                    $('#digit-1').focus();
                    $('.resend_loader').css('display', 'none')
                    $('#times').show()
                    sendCode(data.time)

                    if (data.resend <= 0) {
                        $('#limit').html(`<span class="text-danger">* You reach your maximum attempt</span>`)
                        $('#remove_para').hide()
                        $('#otp_resend_code').remove()
                    } else {
                        $('#limit').html(`You can still try <span class="text-danger">${data.resend}</span> times to send otp`)

                    }

                } else {
                    $('#otp_resend_code').show()
                }

            })
            .fail(function (msg) {
                console.log(msg);
                $('#otp_resend_code').show()
            })
            .always(function () {
                $('.loader').css('display', 'none')
                $('#otp_verify_submit').removeClass('btn-loading');
                resend_code = true
            });
    })
})


let emailRegex = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;
let email = document.getElementById('email')

$('#email').keyup(() => {
    email.classList.remove("red-border");
    $('#error_forgot_emailing_block').removeClass('display_block').addClass('display_none');
})
function emailvalid() {
    if (String(email.value).length > 0) {
        if (!String(email.value).match(emailRegex)) {
            email.classList.add("red-border");
            $('#error_forgot_emailing_block').removeClass('display_none').addClass('display_block');
            $('#error_forgot_emailing_form').text("Invalid Email ID");
            return false;

        }
        else {
            email.classList.remove("red-border");
            return true;
        }
    } else {
        email.classList.add("red-border");
        return false;
    }

}

$('#forgot_password_btn').click(() => {

    if (emailvalid()) {
    $('#error_forgot_emailing_block').removeClass('display_block').addClass('display_none');
        disable('#forgot_password_btn', '#forgot_password_text', '#loader', 1)
        fetch('/reset_password', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'email': email.value,
            })
        }).then(res => res.json()).then((data) => {
            if (data.status == 100) {
                $('#forgot_emailing_success_block').removeClass('display_none').addClass('display_block');
            $('#forgot_emailing_success_text').text(data.status_desc);
                setTimeout(() => {
                    disable('#forgot_password_btn', '#forgot_password_text', '#loader');
                 $('#forgot_emailing_success_block').removeClass('display_block').addClass('display_none');
                    location.href = '/'
                }, 2001)
            } else {
                disable('#forgot_password_btn', '#forgot_password_text', '#loader')
            $('#error_forgot_emailing_block').removeClass('display_none').addClass('display_block');
            $('#error_forgot_emailing_form').text(data.status_desc);

            }
        }).catch((err) => {
            console.log(err);
        })

    }

});


function passwordValid(field) {
    $('#error_forgot_password_block').removeClass('display_block').addClass('display_none');
    $(field).removeClass('red-border');

    let strength = 0;
    let password=$(field).val();
   if(password==''){
    $(field).addClass('red-border');
    return false;
   }
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
    if (strength==4) {
        $(field).removeAttr('style');
        return true;
    } else {
        return false;
    }
}
$('#forgot_password').keyup(() => passwordValid('#forgot_password'));

$('#confirm_pass').keyup(()=>{
    $('#error_forgot_password_block').removeClass('display_block').addClass('display_none');
});

$('#save_forgot_password').click(() => {

    if (passwordValid('#forgot_password')) {
        if($('#forgot_password').val()==$('#confirm_pass').val()){
              fetch('/forgot_password', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'token': $('#token').val(),
                'password': $('#forgot_password').val()
            })
        }).then(res => res.json()).then((data) => {
            if (data.status == 100) {
                $('#forgot_password_success_block').removeClass('display_none').addClass('display_block');
                $('#forgot_password_success_form').text(data.status_desc);

                setTimeout(() => {
                $('#forgot_password_success_block').removeClass('display_block').addClass('display_none');
                    location.href = '/'
                }, 1500)
            } else {
            $('#error_forgot_password_block').removeClass('display_none').addClass('display_block');
            $('#error_forgot_password_form').text(data.status_desc);

            }
        }).catch((err) => {
            console.log(err);
        })
        }else{
            $('#error_forgot_password_block').removeClass('display_none').addClass('display_block');
            $('#error_forgot_password_form').text("New Password and Confirm Password doesn't match");
        }
      

    } else {
        if($('#forgot_password').val() != ''){
             $('#error_forgot_password_block').removeClass('display_none').addClass('display_block');
        $('#error_forgot_password_form').text('Password Must Be AlphaNumeric 8 Characters');
        }
        $('#forgot_password').css('border', '1px solid red');
       

    }
})


