const emailField = document.getElementById("email")
const errElement = document.getElementById("email_error")
const submitbtn = document.getElementById("submit_btn")
const resendBtn = document.getElementById("resend_button")
const updatePassword_btn = document.getElementById("reset_btn") //btn
const show_newPasssword = document.querySelector("#show-newpassword")
const show_confirmPassword = document.querySelector("#show-confirmpassword")
const newpassInputEl = document.querySelector("#newpassword")
const confirmpassInputEl = document.querySelector("#confirmpassword")
const inputElementsArr = [newpassInputEl, confirmpassInputEl]
const notificationContainer = document.getElementById("response_container")
const alertElement = document.getElementById("alert")
const emailErrors = {}
const error = {}   // for errors in password fields

const showErrorMessage = (fieldName) => {
  const errElement = document.getElementById(`${fieldName}_error`)
  errElement.textContent = error[fieldName]
  if (errElement.style.display === "none") {
    errElement.style.display = "block"
  }
}
const showSuccessMessage = (currentInputField, event) => {
  const fieldName = currentInputField.name
  const errorElement = document.getElementById(`${fieldName}_error`)
  errorElement.innerText = ""
  if (!error[fieldName]) {
    errorElement.textContent = ""
    if (currentInputField.classList.contains("is-invalid")) {
      currentInputField.classList.remove("is-invalid")
    }
    if (event.type == "blur") {
      if (!currentInputField.classList.contains("is-valid")) {
        currentInputField.classList.add("is-valid")
      }
      currentInputField.nextElementSibling.style.borderColor = "#2fb344"
    }
  }
}

let minutes = 2
let seconds = 0
let timer;
if (resendBtn) {
  resendBtn.addEventListener("click", () => {
    resendEmail(email)
  })
}

const startTimer = () => {
  seconds--
  if (!timer) {
    return
  }
  if (seconds < 0) {
    seconds = 59
    minutes--
  }
  let s = seconds < 10 ? "0" + seconds : seconds
  let m = minutes < 10 ? "0" + minutes : minutes
  document.getElementById("timer").innerText = `${m}:${s}`
  if (minutes == 0 && seconds == 0) {
    clearInterval(timer)
    minutes = 2; seconds =0   // reset the timer 
    resendBtn.classList.remove("visually-hidden")
    document.getElementById("timer").innerText = `02:00`
    document.getElementById("timer_block").classList.add("visually-hidden")
    document.getElementById("alert").classList.remove("alert-success")
    document.getElementById("alert").classList.add("visually-hidden")
  }
}
const showsuccessalert = (successMessage) => {
  alertElement.classList.remove("visually-hidden", "alert-danger","border-danger")
  alertElement.classList.add("alert-success", "border-success")
  document.querySelector(".alert-title").innerText = "Success!"
  document.getElementById("alert_message").innerText = successMessage

}
const showerrorAlert = (errorMessage) => {
  alertElement.classList.remove("visually-hidden", "alert-success", "border-success")
  alertElement.classList.add("alert-danger", "border-danger")
  document.querySelector(".alert-title").innerText = "Error!"
  document.getElementById("alert_message").innerText = errorMessage
}


const showpassword = (inputEl, ele) => {
  if (inputEl.type == "password") {
    inputEl.type = "text"
    ele.setAttribute("data-bs-original-title", "Hide password")
    ele.setAttribute("aria-label", "Hide password")
    ele.querySelector('#svg_hide').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
      <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
      <path d="M3 3l18 18"></path>
   </svg>`

  }
  else {
    inputEl.type = "password"
    ele.setAttribute("data-bs-original-title", "Show password")
    ele.setAttribute("aria-label", "Show password")
    ele.querySelector("#svg_hide").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
      viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
      stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6">
      </path>
    </svg>`
  }
}


if (inputElementsArr.length > 0) {
  inputElementsArr.forEach(inputField => {
    if (inputField) {
      const fieldName = inputField.name
      const errorElement = document.getElementById(`${fieldName}_error`)
      if (inputField) {
        inputField.addEventListener("input", (e) => {
          inputField.classList.remove("is-invalid", "is-valid")
          errorElement.style.display = "none"
          document.getElementById("alert").classList.remove("alert-danger")   //remove alert danger when any changes happen in input and hide it
          document.getElementById("alert").classList.add("visually-hidden")
        })
      }
    }

  })
}

const validatePassword = (currentInputField, event) => {

  const value = currentInputField.value
  const fieldName = currentInputField.name
  const digitRegEx = /(?=.*[0-9])/
  const specialCharRegEx = /(?=.*[@#$%^&-+=()])/
  const CapitletterRegEx = /(?=.*[A-Z])/
  const hasUpperCase = CapitletterRegEx.test(value)
  const hasSpecialCharacter = specialCharRegEx.test(value)
  const hasDigit = digitRegEx.test(value)
  const hasMinLength = value.length >= 6;

  if (value.trim().length == 0) {
    error[fieldName] = "This field is mandatory"
    showErrorMessage(fieldName)
      currentInputField.classList.add("is-invalid")
      currentInputField.classList.remove("is-valid")
    currentInputField.nextElementSibling.style.borderColor = "red"
    return
  }
  if (!hasDigit && !hasSpecialCharacter && !hasUpperCase && !hasMinLength) {
    error[fieldName] = "Password must contains at least six characters, one digit, one uppercase letter and one special character"
    showErrorMessage(fieldName)
      currentInputField.classList.add("is-invalid")
      currentInputField.classList.remove("is-valid")
    currentInputField.nextElementSibling.style.borderColor = "red"
    return
  }

  if (!hasMinLength) {
    if (!hasDigit && !hasSpecialCharacter) {
      error[fieldName] = "Password must contains at least six characters, one digit and one special character"
    }
    else if (!hasUpperCase && !hasDigit) {
      error[fieldName] = "Password must contains at least six characters, one upper case letter and one digit"
    }
    else if (!hasUpperCase && !hasSpecialCharacter) {
      error[fieldName] = "Password must contains at least six characters, one upper case letter and one special character"
    }
    else if (!hasDigit) {
      error[fieldName] = "Password must contains at least six characters and one digit"
    }
    else if (!hasSpecialCharacter) {
      error[fieldName] = "Password must contains at least six characters and one special character"
    }
    else {
      error[fieldName] = "Password must contains at least six characters"
    }
    showErrorMessage(fieldName)
      currentInputField.classList.add("is-invalid")
      currentInputField.classList.remove("is-valid")
      currentInputField.nextElementSibling.style.borderColor = "red"

    return
  }

  if (!hasDigit && !hasSpecialCharacter && !hasUpperCase) {
    error[fieldName] = "Password must contains atleast one digit, one special character and one uppercase letter"
    showErrorMessage(fieldName)
      currentInputField.classList.add("is-invalid")
      currentInputField.classList.remove("is-valid")
      currentInputField.nextElementSibling.style.borderColor = "red"
    return
  }
  if (!hasDigit) {
    if (!hasSpecialCharacter) {
      error[fieldName] = "Password must contains at least one digit and one special character"
    }
    else if (!hasUpperCase) {
      error[fieldName] = "Password must contains at least one digit and one upper case letter"
    }
    else {
      error[fieldName] = "Password must contains at least one digit"
    }

    showErrorMessage(fieldName)
      currentInputField.classList.add("is-invalid")
      currentInputField.classList.remove("is-valid")
      currentInputField.nextElementSibling.style.borderColor = "red"
      return    

  }

  if (!hasUpperCase) {
    if (!hasSpecialCharacter) {
      error[fieldName] = " Password must contains at least one uppercase letter and one special capital letter"

    }
    else if (!hasDigit) {
      error[fieldName] = "Password must contains at least one uppercase letter and one digit"
    }

    else {
      error[fieldName] = "Password must contain at least one uppercase letter"
    }
    showErrorMessage(fieldName)
      currentInputField.classList.add("is-invalid")
      currentInputField.classList.remove("is-valid")   
      currentInputField.nextElementSibling.style.borderColor = "red"
      return
  }

  if (!hasSpecialCharacter) {
    if (!hasUpperCase) {
      error[fieldName] = " Password must contains at least one special character and one uppercase letter"
    }
    else if (!hasDigit) {
      error[fieldName] = "Password must contains at least one special character  and one digit"
    }
    else {
      error[fieldName] = "Password must contains at least one special character"
    }
    showErrorMessage(fieldName)
      currentInputField.classList.add("is-invalid")
      currentInputField.classList.remove("is-valid")
      currentInputField.nextElementSibling.style.borderColor = "red"
    return
  }
  if (currentInputField.name == "confirmpassword") {
    if (newpassInputEl.value !== currentInputField.value) {
      error[fieldName] = "New password and confirm password not matched"
        currentInputField.classList.add("is-invalid")
        currentInputField.classList.remove("is-valid")
      
      currentInputField.nextElementSibling.style.borderColor = "red"
      showErrorMessage(fieldName)
    }
    else {
      delete error[fieldName]
      showSuccessMessage(currentInputField, event)
    }
    return
  }
 if (currentInputField.name == "newpassword" && confirmpassInputEl.value.trim() !== "") {
      if (currentInputField.value !== confirmpassInputEl.value) {
        if (!error['confirmpassword']) {
          error[confirmpassInputEl.name] = "New password and confirm password not matched"
            confirmpassInputEl.classList.remove("is-valid")
            confirmpassInputEl.classList.add("is-invalid")
            confirmpassInputEl.nextElementSibling.style.borderColor = "red"
          showErrorMessage("confirmpassword")
        }
      }
      else {
        delete error["confirmpassword"]
        showSuccessMessage(confirmpassInputEl, event)
      }
    }

    
    delete error[fieldName]
    showSuccessMessage(currentInputField, event)

}



if (show_newPasssword) {
  show_newPasssword.addEventListener("click", () => {
    showpassword(newpassInputEl, show_newPasssword)
  })
}

if (show_confirmPassword) {
  show_confirmPassword.addEventListener("click", () => {
    showpassword(confirmpassInputEl, show_confirmPassword)
  })
}

if (inputElementsArr.length > 0) {
  inputElementsArr.forEach(element => {
    if (element) {
      element.addEventListener("blur", (event) => {
        const currentInputEl = event.target
        validatePassword(currentInputEl, event)
      })
    }

  })
}
if (updatePassword_btn) {
  
  updatePassword_btn.addEventListener('click', async (event) => {
    validatePassword(confirmpassInputEl, event)
    validatePassword(newpassInputEl, event)
    if (Object.keys(error).length == 0) {
      const data = {
        newpassword: newpassInputEl.value,
        confirmPassword: confirmpassInputEl.value
      }
      const url_string = window.location.href
      const url = new URL(url_string);
      const token = url.searchParams.get("token");
      const response = await fetch(`/api/resetpassword?token=${token}`, { method: "put", body: JSON.stringify(data), headers: { 'Content-Type': "application/json" } })
      const { message,status } = await response.json()
      if (status == "200") {
        showsuccessalert(message)
        setTimeout(() => {
          document.getElementById("alert").classList.remove("alert-success")
          document.getElementById("alert").classList.add("visually-hidden")
          window.location.replace("/users/profile")
        }, 2000)
      }
      else {
        showerrorAlert(message)
     
      }
    }
  })
}

const resendEmail = async (email) => {
  resendBtn.innerText = "Please wait..."
  document.getElementById("loadingSpinner-2").classList.remove("visually-hidden")
  const response = await fetch("/api/forgotpassword", {
    method: "post",
    body: JSON.stringify({ email: email }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  const { message,status} = await response.json()
  if (status == "200") {
    resendBtn.classList.add("visually-hidden")
    document.getElementById("loadingSpinner-2").classList.add("visually-hidden")
    showSuccessNotification(message)
    resendBtn.innerText = "Resend email"
    timer = setInterval(startTimer, 1000)
    document.getElementById("timer_block").classList.remove("visually-hidden")
  }
  else {
    submitbtn.classList.remove("disabled")
    document.getElementById("loadingSpinner-2").classList.add("visually-hidden")
    showErrorNotification(message)
  }
}

const showSuccessNotification = (message) => {
  alertElement.classList.remove("visually-hidden", "alert-danger","border-danger")
  alertElement.classList.add("alert-success", "border-success")
  document.querySelector(".alert-title").innerText = "Success!"
  document.getElementById("alert_message").innerText = message
  emailField.classList.remove("is-invalid")
  emailField.classList.add("is-valid")

}

const showErrorNotification = (message, event) => {
  alertElement.classList.remove("visually-hidden","alert-success", "border-success")
  alertElement.classList.add("alert-danger", "border-danger")
  document.querySelector(".alert-title").innerText = "Error!"
  document.getElementById("alert_message").innerText = message
  emailField.classList.remove("is-valid")
  emailField.classList.add("is-invalid")

}
const showError = (emailField) => {
  const fieldName = emailField.name
    emailField.classList.remove("is-valid")
  emailField.classList.add("is-invalid")
  document.getElementById(fieldName + "_error").innerText = emailErrors[fieldName]
    errElement.style.display = "block"
  

}
const noError = (emailField, event) => {
  const fieldName = emailField.name
  const errorElement = document.getElementById(`${fieldName}_error`)
  if (!emailErrors[fieldName]) {
    errorElement.textContent = ""
    emailField.classList.remove("is-invalid")
    if (event.type == "blur") {
      emailField.classList.add("is-valid")
    }
  }
}

if (emailField) {
  emailField.addEventListener("keyup", (e) => {
    emailField.classList.remove("is-invalid", "is-valid")
    errElement.style.display = "none"
    alertElement.classList.remove("alert-danger")
    alertElement.classList.add("visually-hidden")
  })

}

const validateEmail = (inputField, event) => {
  const inputName = inputField.name
  const email = inputField.value
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  if (email.trim() === "") {
    emailErrors[inputName] = "This field is required"
    return showError(inputField)

  }
  const hasEmail = emailRegex.test(email)
  if (!hasEmail) {
    emailErrors[inputName] = "Please enter a valid email address"
    return showError(inputField, event)
  }
  delete emailErrors[inputName]
  return noError(inputField, event)

}

if (emailField) {
  emailField.addEventListener("blur", async (event) => {
    const inputField = event.target
    validateEmail(inputField, event)
  })
}

let email;
if (submitbtn) {
  submitbtn.addEventListener("click", async (event) => {
    validateEmail(emailField, event)
    email = emailField.value
    if (Object.keys(emailErrors) == 0) {
      submitbtn.innerText = "Please wait..."
      resendBtn.classList.add("visually-hidden")
      document.getElementById("loadingSpinner").classList.remove("visually-hidden")
      const response = await fetch("/api/forgotpassword", {
        method: "post",
        body: JSON.stringify({ email: emailField.value }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const { message, status } = await response.json()
      if (status == "200") {
        submitbtn.classList.add("visually-hidden")
        submitbtn.innerText = 'Reset password'
        document.getElementById("loadingSpinner").classList.add("visually-hidden")
        showSuccessNotification(message)
        // enable and set the timer
        document.getElementById("timer_block").classList.remove("visually-hidden")
        timer = setInterval(startTimer, 1000)
      }
      else {
        submitbtn.innerText = "Reset password"
        document.getElementById("loadingSpinner").classList.add("visually-hidden")
        showErrorNotification(message)
      }
    }
  }
  )
}










