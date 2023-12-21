
let imageInput = document.getElementById('imageInput')

const profile_image = document.getElementById('profile_image')

const top_image = document.getElementById('top_image')

const user_name = document.getElementById('user_name')

const user_name_err = document.getElementById('user_name_err')

const imagepreview = document.getElementById('imagepreview')

let image_check;

let name_check = true
// imageInput.addEventListener('change',()=>{
//     profile_image.src = window.URL.createObjectURL(this.files[0])
//     console.log(profile_image.src)

// })




$('#settingForm').submit((e) => {
    e.preventDefault()
    if(profile_image.src === imagepreview.src){
        $('#ImageUploadError').modal('show')
        setTimeout(() => {
            $('#ImageUploadError').modal('hide')
        }, 1000)
    }else{
        const imageUplodad = document.getElementById('imageInput')
        const data = new FormData()
    
        data.append('file', imageUplodad.files[0])
    
    
        console.log(data)
        e.preventDefault()
        fetch("http://localhost:8000/ImageUpload", {
            method: "POST",
            headers: {
                "enctype": "multipart/form-data",
    
            },
            body: data
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    $('#imageupdateSuccess').modal('show')
                    setTimeout(() => {
                        $('#imageupdateSuccess').modal('hide')
                    }, 1000)
                    $('#previewImageModal').modal('hide')
                    top_image.src = `uploads/${data.file}`
                    profile_image.src = `uploads/${data.file}`
                } else if (data.status === 400) {
                    $('#ImageUploadError').modal('show')
                    setTimeout(() => {
                        $('#ImageUploadError').modal('hide')
                    }, 1000)
                }
    
            })
    
    
    
    }
    

    
})

let input_value = '';

const value_return = (value) => {
    return input_value = value
}

$(document).ready(() => {
    fetch('http://localhost:8000/get_user_details', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },

    }).then((res) => res.json())
        .then((data) => {

            value_return(data.data.name)
            $('#top_name').html(`${data.data.name}`)
            $("#user_name").val(`${data.data.name}`)
            $('#user_name_id').val(`${data.data.id}`)
            top_image.src = `uploads/${data.data.Image}`
            profile_image.src = `uploads/${data.data.Image}`
        })
})



$('#delete_avatar').click(() => {

    if (profile_image.src !== `http://localhost:8000/uploads/default_avatar.jpg`) {
        $('#delete_avatar_modal').modal('show')
    }

})

$("#delete_btn_avatar").click(() => {
    console.log('click')
    fetch('http://localhost:8000/deleteAvatar', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => res.json())
        .then((data) => {
            if (data.status === 200) {
                imageInput.value = ''

                $('#deleteAvatarDelete').modal('show')
                setTimeout(() => {
                    $('#deleteAvatarDelete').modal('hide')
                }, 1000);
                top_image.src = `uploads/${data.image}`
                profile_image.src = `uploads/${data.image}`
            }
        })
})

$("#cancel_image").click(() => {
    imageInput.value = ''
})

$("#change_avatar").click((e) => {

    e.preventDefault()

    imagepreview.src = profile_image.src

    $('#previewImageModal').modal('show')
})




$("#show_edit").click(() => {

    if (user_name.disabled) {
        user_name.disabled = false
        $("#edit_icons").html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit-off" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
    <path d="M10.507 10.498l-1.507 1.502v3h3l1.493 -1.498m2 -2.01l4.89 -4.907a2.1 2.1 0 0 0 -2.97 -2.97l-4.913 4.896" />
    <path d="M16 5l3 3" />
    <path d="M3 3l18 18" />
  </svg>`)
        $("#user_name_update").fadeIn('fast')
    } else {
        user_name.disabled = true
        $('#edit_icons').html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
    <path d="M16 5l3 3" />
  </svg>`)
        user_name.value = input_value
        remove(user_name)
        $("#user_name_update").fadeOut('fast')
    }
})

$("#user_name_update").click((e) => {
    e.preventDefault()
    if (isvalid()) {
        if (input_value !== user_name.value.trim()) {
            const data = {
                name: user_name.value.trim()
            }
            fetch("http://localhost:8000/nameUpdate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
                .then((response) => {
                    if (response.status === 200) {
                        value_return(data.name)
                        $('#top_name').html(`${data.name}`)
                        user_name.value = data.name;
                        user_name.disabled = true
                        $('#edit_icons').html(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
    <path d="M16 5l3 3" />
  </svg>`)
                        user_name.value = input_value;
                        remove(user_name)
                        $("#user_name_update").hide()
                        $("#namechangeSuccess").modal('show')
                        setTimeout(() => {
                            $("#namechangeSuccess").modal('hide')
                        }, 1000)
                    } else if (response.status === 501) {
                        window.location.href = './serverError'
                    }
                })
        }


    }

})

function isvalid() {
    let value = true
    if (user_name.value === '') {
        value = false
        show_errors(user_name_err, "* Please fill the name input ", user_name)
    } else if (!name_check) {
        value = false
        show_errors(user_name_err, "* Name Field did not contain a Number", user_name)
    }
    return value
}

$("#user_name").keyup(() => {


    if (user_name.value.search(/[0-9]/) > 0 || user_name.value.search(/[0-9]/) === 0) {
        name_check = false
        show_errors(user_name_err, 'Name field doesnot contain a number', user_name)
    } else {
        name_check = true
        show_errors(user_name_err, '')
        remove_cls(user_name)
    }

})

const remove_cls = (remove_cls) => {

    remove_cls.classList.remove('is-invalid')
    remove_cls.classList.add('is-valid')

}

const show_errors = (err, msg, add_class) => {
    err.innerHTML = `${msg}`
    add_class?.classList.add('is-invalid')
}

const remove = (cls) => {
    cls.classList.remove('is-invalid')
    cls.classList.remove('is-valid')
}